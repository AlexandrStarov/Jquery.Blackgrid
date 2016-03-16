(function ($, window, document) {
    $.BlackGrid = {};
    var _tables = {};
    var _tablesCache = {};

    $.BlackGrid.Create = function (tableParameters, searchingParameters) {
        var tableId = "tbl-" + tableParameters.Id
        _tables[tableId] = tableParameters;
        _tables[tableId]['SearchingParameters'] = searchingParameters;

        if (searchingParameters.GlobalSearch) {
            $('#' + tableParameters.Id).append(_getGlobalSearchMarkup() + '<br />' + '<br />');
        }

        var cells = '';
        $.each(tableParameters.Columns, function (index, value) {
            cells += '<td data-name="' + this.name + '" data-searchable="' + this.searchable + '">' + this.text + '</td>\n';
        });
        $('#' + tableParameters.Id).append('<div class="blackgrid-main"><table id="' + tableId + '" class="' + tableParameters.TableClasses + '"><thead><tr>' + cells + '</tr></thead><tbody></tbody></table></div>')

        _loadChildren(null, tableParameters.Url, tableId)
    };

    $.BlackGrid.GetObject = function (tableId, rowIndex) {
        var tdArr$ = $('#' + tableId + ' tbody tr:eq(' + rowIndex + ') td');
        var headDictionary = _getHeadDictionary(tableId);
        var rowObject = {};
        $.each(headDictionary, function (key, value) {
            rowObject[key] = $.trim($(tdArr$[value]).text());
        });
        return rowObject;
    };

    function _getHeadDictionary(tableId) {
        var rowObject = {};
        $.each($('#' + tableId + ' thead tr:first td'), function (index, value) {
            rowObject[$(this).data('name')] = index;
        });
        return rowObject;
    }

    function _combineRow(data, paddingLeft, parentId, headDictionary) {
        var icon = data.HasChildren ? _getIconCaretRight() : _getEmptyIcon();
        paddingLeft += 14;
        var rowData = '';

        $.each(headDictionary, function (key, value) {
            if (value == 0) {
                rowData += '<td style="padding-left:' + paddingLeft + 'px;">' + icon + ' ' + data[key] + '</td>'
            } else {
                rowData += '<td>' + data[key] + '</td>'
            }
        });

        return '<tr data-role="row" data-id="' + data.Id + '" data-parentId="' + parentId + '" data-haschildren="' + data.HasChildren + '">' + rowData + '</tr>';
    }

    function _combineSearchingRow(data, headDictionary) {
        var rowData = '';

        $.each(headDictionary, function (key, value) {
            rowData += '<td>' + data[key] + '</td>'
        });

        return '<tr data-role="row" data-id="' + data.Id + '">' + rowData + '</tr>';
    }

    function _loadChildren(parent$, url, tableId) {
        var padddingLeft = 0;
        var parentId = null;

        if (parent$ != null) {
            padddingLeft = parseInt($('td:first', $(parent$)).css('padding-left').replace(/[^-\d\.]/g, ''));
            parentId = $(parent$).data('id');
        }

        var model = _getQueryModel(parentId, tableId, null);
        _enableLoading(tableId, true);

        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {
                _enableLoading(tableId, false);
                $(document).trigger('BlackGrid_DownloadSuccessful', [tableId, url]);
                var headDictionary = _getHeadDictionary(tableId)

                if (parentId == null) {
                    $.each(data, function (index, value) {
                        if (value.ParentId == parentId) {
                            var tr = _combineRow(value, padddingLeft, parentId, headDictionary);
                            $('#' + tableId + ' > tbody:last-child').append(tr).index('tr:first-child');
                        }
                    });
                } else {
                    $.each(data, function (index, value) {
                        if (value.ParentId === parentId) {
                            $(parent$).after(_combineRow(value, padddingLeft, $(parent$).data('id'), headDictionary));
                        }
                    });
                }
            },
            dataType: "json"
        });
    }

    function _removeChildren(parentId, tableId) {
        var currentIndex = $('tr[data-id="' + parentId + '"]').index() + 1;
        var table = document.getElementById(tableId)
        var countRows = table.rows.length;
        var maxPadding = parseInt(window.getComputedStyle(table.rows[currentIndex].cells[0], null).getPropertyValue('padding-left'));

        for (var i = currentIndex + 1; i < countRows; i++) {
            var tempPadding = parseInt(window.getComputedStyle(table.rows[i].cells[0], null).getPropertyValue('padding-left'));
            if (tempPadding > maxPadding) {
                document.getElementById(tableId).deleteRow(i);
                i--;
            } else {
                break;
            }
        }
    }

    function _getIconCaretRight() {
        return '<i class="fa fa-caret-right fa-lg grid-icon"></i>';
    };

    function _getEmptyIcon() {
        return '<i class="empty-icon"></i>';
    }

    function _getQueryModel(parentId, tableId, searchingText) {
        var searchingColumns = [];

        $.each($('#' + tableId + ' thead tr:first td'), function (index, value) {
            if ($(this).data('searchable') == true) {
                searchingColumns.push($(this).data('name'))
            }
        });

        var model = {
            ParentId: parentId,
            SearchingColumns: searchingColumns,
            SearchingText: searchingText
        };

        return model;
    };

    function _getGlobalSearchMarkup() {
        var input =
            '<div class="form-inline">'
                + '<div class="form-group pull-right">'
                    + '<div class="inner-addon right-addon">'
                        + '<i class="fa fa-search"></i>'
                        + '<input type="text" class="form-control bg-global-search" placeholder="Search" />'
                    + '</div>'
                + '</div>'
            + '</div>'
        return input;
    };

    function _getTableIdFromGlobalSearch(input$) {
        return $(input$).closest('[id]').find('table').attr('id');
    }

    function _enableLoading(tableId, enable) {
        if (enable) {
            var overlay = '<div class="overlay"><i class="fa fa-spinner fa-pulse"></i></div>';
            $('#' + tableId).closest('div').append(overlay);
        } else {
            $('#' + tableId).closest('div').find('.overlay').remove();
        }
    };

    $(document).on('click', 'i.grid-icon', function () {
        var tr$ = $(this).closest('tr');
        var tableId = $(this).closest('table').attr('id');

        if ($(this).hasClass('fa-caret-right')) {
            $(this).removeClass('fa-caret-right').addClass('fa-caret-down');
            _loadChildren(tr$, _tables[tableId].Url, tableId);
        } else {
            $(this).removeClass('fa-caret-down').addClass('fa-caret-right');
            _removeChildren($(tr$).data('id'), tableId);
        }
    });

    $(document).on('keydown', '.bg-global-search[type="text"]', function () {
        var tableId = _getTableIdFromGlobalSearch(this);

        if ($(this).val().length < _tables[tableId].SearchingParameters.MinimalLengthOfTheSearch) {
            _tablesCache[tableId] = $('#' + tableId).find('tbody tr').clone(true);
        }
    });

    $(document).on('keyup', '.bg-global-search[type="text"]', function () {
        var tableId = _getTableIdFromGlobalSearch(this);

        if (_tables[tableId].SearchingParameters.GlobalSearch && $(this).val().length >= _tables[tableId].SearchingParameters.MinimalLengthOfTheSearch) {
            var model = _getQueryModel(null, tableId, $(this).val());
            var url = _tables[tableId].Url;
            _enableLoading(tableId, true);

            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {
                    _enableLoading(tableId, false);
                    var headDictionary = _getHeadDictionary(tableId)
                    $('#' + tableId + ' > tbody').empty();

                    $.each(data, function (index, value) {
                        var tr = _combineSearchingRow(value, headDictionary);
                        $('#' + tableId + ' > tbody:last-child').append(tr).index('tr:first-child');
                    });
                },
                dataType: "json"
            });
        } else {
            $('#' + tableId).find('tbody').empty().append(_tablesCache[tableId].clone());
        }
    });

    $(document).on("click", "tbody tr", function () {

        if ($(this).hasClass("blackgrid-selected")) {
            $(this).removeClass("blackgrid-selected");
        } else {
            var tableId = $(this).closest('table').attr('id');
            $('#' + tableId + ' tr').removeClass("blackgrid-selected");
            $(this).addClass("blackgrid-selected");
            $(document).trigger('BlackGrid_SelectedRow', [tableId, $(this).index()]);
        }
    });
})(jQuery, window, document);