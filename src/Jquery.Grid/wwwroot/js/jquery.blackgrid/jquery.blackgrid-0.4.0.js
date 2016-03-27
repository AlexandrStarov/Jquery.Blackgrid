(function ($, window, document) {
    $.BlackGrid = {};
    var _tables = {};
    var _tablesCache = {};
    var _checkedObjects = {};

    $.BlackGrid.Create = function (tableParameters, searchingParameters) {
        var tableId = "tbl-" + tableParameters.id
        _tables[tableId] = tableParameters;
        _tables[tableId]['searchingParameters'] = searchingParameters;

        if (searchingParameters.globalSearch) {
            $('#' + tableParameters.id).append(_getGlobalSearchMarkup() + '<br />' + '<br />');
        }

        var mainCheckbox = ['', ''];
        if (tableParameters.enableCheckBox) {
            mainCheckbox = ['<label class="checkbox-inline"><input type="checkbox" data-name="main"> ', '</label>'];
        }

        var cells = '';
        $.each(tableParameters.сolumns, function (index, value) {
            if (index == 0) {
                cells += '<td data-name="' + this.name + '" data-searchable="' + this.searchable + '">' + mainCheckbox[0] + this.text + mainCheckbox[1] + '</td>\n';
            } else {
                cells += '<td data-name="' + this.name + '" data-searchable="' + this.searchable + '">' + this.text + '</td>\n';
            }
        });
        $('#' + tableParameters.id).append('<div class="blackgrid-main"><table id="' + tableId + '" class="' + tableParameters.tableClasses + '"><thead><tr>' + cells + '</tr></thead><tbody></tbody></table></div>')

        _loadChildren(null, tableParameters.url, tableId);
    };

    function _hideColumns(tableId) {
        var headDictionary = _getHeadDictionary(tableId);
        var columnsParameters = _tables[tableId].сolumns;

        $.each(headDictionary, function (key, value) {
            $.each(columnsParameters, function (index, column) {
                if (column.visible == false && column.name == key) {
                    $('#' + tableId + ' td:nth-child(' + (value + 1) + ')').hide();
                }
            });
        });
    }

    $.BlackGrid.GetObject = _getObjectById;

    $.BlackGrid.GetSelectedObject = function (tableId) {
        var objectId = $('#' + tableId + ' tbody tr.blackgrid-selected').data('id');
        return _getObjectById(tableId, objectId);
    };

    $.BlackGrid.GetCheckedObjects = _getCheckedObjects;

    function _getObjectById(tableId, objectId) {
        var tdArr$ = $('#' + tableId + ' tbody tr[data-id=' + objectId + '] td');
        var headDictionary = _getHeadDictionary(tableId);
        var rowObject = {};
        $.each(headDictionary, function (key, value) {
            rowObject[key] = $.trim($(tdArr$[value]).text());
        });
        rowObject['id'] = objectId;
        rowObject['ParentId'] = $('#' + tableId + ' tbody tr[data-id=' + objectId + ']').data('parentid');
        return rowObject;
    }

    function _getCheckedObjects(tableId) {
        return _checkedObjects['tbl-' + tableId];
    }

    function _getHeadDictionary(tableId) {
        var rowObject = {};
        $.each($('#' + tableId + ' thead tr:first td'), function (index, value) {
            rowObject[$(this).data('name')] = index;
        });
        return rowObject;
    }

    function _combineRow(data, paddingLeft, parentId, headDictionary, tableId) {
        var icon = data.HasChildren ? _getIconCaretRight() : _getEmptyIcon();
        paddingLeft += 14;
        var rowData = '';
        var checked = false;
        if (_tables[tableId].enableCheckBox) {
            checked = $('#' + tableId).find('tr[data-id=' + parentId + ']').find('input[type=checkbox]').is(':checked');
        }
        var columnsParameters = _tables[tableId].сolumns;

        $.each(headDictionary, function (key, value) {
            if (value == 0) {
                if (_tables[tableId].enableCheckBox) {
                    rowData += '<td style="padding-left:' + paddingLeft + 'px;">' + icon + ' <label class="checkbox-inline"><input type="checkbox" ' + _getFinalDecisionByCheckbox(checked, data.Id, tableId) + '> ' + data[key] + '</label></td>'
                } else {
                    rowData += '<td style="padding-left:' + paddingLeft + 'px;">' + icon + ' ' + data[key] + '</td>'
                }
            } else {
                rowData += '<td>' + data[key] + '</td>'
            }
        });

        return '<tr data-role="row" data-id="' + data.Id + '" data-parentId="' + parentId + '" data-haschildren="' + data.HasChildren + '">' + rowData + '</tr>';
    }

    function _getFinalDecisionByCheckbox(checked, objectId, tableId) {
        var objs = _checkedObjects[tableId]
        var contains = false;

        if (objs != undefined) {
            $.each(objs, function (index, obj) {
                if (obj.id == objectId) {
                    contains = true;
                }
            });
        }

        var isChecked = '';
        if (checked || contains) {
            isChecked = 'checked';
        }

        return isChecked;
    }

    function _combineSearchingRow(data, headDictionary) {
        var rowData = '';

        $.each(headDictionary, function (key, value) {
            rowData += '<td>' + data[key] + '</td>'
        });

        return '<tr data-role="row" data-id="' + data.id + '">' + rowData + '</tr>';
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
                var enableCheckbox = _tables[tableId].enableCheckBox;

                if (parentId == null) {
                    $.each(data, function (index, value) {
                        if (value.ParentId == parentId) {
                            var tr = _combineRow(value, padddingLeft, parentId, headDictionary, tableId);
                            $('#' + tableId + ' > tbody:last-child').append(tr).index('tr:first-child');
                        }
                    });
                } else {
                    $.each(data, function (index, value) {
                        if (value.ParentId == parentId) {
                            $(parent$).after(_combineRow(value, padddingLeft, $(parent$).data('id'), headDictionary, tableId));
                        }
                    });
                }

                _hideColumns(tableId);
            },
            dataType: "json"
        });
    }

    function _removeChildren(parentId, tableId) {
        var rows$ = $('#' + tableId).find('tr[data-parentid=' + parentId + ']');
        $.each(rows$, function (index, tr$) {
            if ($(tr$).data('haschildren')) {
                _removeChildren($(tr$).data('id'), tableId);
            }
            $(tr$).remove();
        });
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

    function _checkedCheckbox(parentId, tableId, checked) {
        var table$ = $('#' + tableId);
        var rows$ = $(table$).find('tr[data-parentid=' + parentId + ']');

        $.each(rows$, function (index, tr$) {
            $(tr$).find('input[type=checkbox]').prop('checked', checked);
            if ($(tr$).data('haschildren')) {
                _checkedCheckbox($(tr$).data('id'), tableId, checked);
            }
        });

        var countChecked = $(table$).find('input[type=checkbox]:checked:not([data-name])').length;
        var countCheckbox = $(table$).find('input[type=checkbox]:not([data-name])').length;
        var checkedMainCheckbox = false;
        if (countChecked == countCheckbox) {
            checkedMainCheckbox = true;
        }

        var currentParentId = $(table$).find('tr[data-id=' + parentId + ']').data('parentid');
        var countParentChecked = $(table$).find('tr[data-parentid=' + currentParentId + '] input[type=checkbox]:checked').length;
        var countParentCheckbox = $(table$).find('tr[data-parentid=' + currentParentId + '] input[type=checkbox]').length;
        var checkedParentCheckbox = false;
        if (countParentChecked == countParentCheckbox) {
            checkedParentCheckbox = true;
        }

        $(table$).find('tr[data-id=' + currentParentId + '] input[type=checkbox]').prop('checked', checkedParentCheckbox);
        $(table$).find('input[type=checkbox][data-name=main]').prop('checked', checkedMainCheckbox);
    };

    function _getCheckedRows(tableId) {
        var checkedRows$ = $('#' + tableId).find('input[type=checkbox]:checked:not([data-name])').closest('tr');
        var objects = [];
        $.each(checkedRows$, function (index, row$) {
            objects.push(_getObjectById($(row$).data('id'), tableId));
        });
        return objects;
    }

    $(document).on('click', 'i.grid-icon', function () {
        var tr$ = $(this).closest('tr');
        var tableId = $(this).closest('table').attr('id');

        if ($(this).hasClass('fa-caret-right')) {
            $(this).removeClass('fa-caret-right').addClass('fa-caret-down');
            _loadChildren(tr$, _tables[tableId].url, tableId);
        } else {
            $(this).removeClass('fa-caret-down').addClass('fa-caret-right');
            _removeChildren($(tr$).data('id'), tableId);
        }
    });

    $(document).on('keydown', '.bg-global-search[type="text"]', function () {
        var tableId = _getTableIdFromGlobalSearch(this);

        if ($(this).val().length < _tables[tableId].searchingParameters.minimalLength) {
            _tablesCache[tableId] = $('#' + tableId).find('tbody tr').clone(true);
        }
    });

    $(document).on('keyup', '.bg-global-search[type="text"]', function () {
        var tableId = _getTableIdFromGlobalSearch(this);

        if (_tables[tableId].searchingParameters.globalSearch && $(this).val().length >= _tables[tableId].searchingParameters.minimalLength) {
            var model = _getQueryModel(null, tableId, $(this).val());
            var url = _tables[tableId].url;
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
            $(document).trigger('BlackGrid_SelectedRow', [tableId, $(this).data('id')]);
            _hideColumns(tableId)
        }
    });

    $(document).on("change", "table input[type=checkbox]", function () {
        var parentId = null;
        var tableId = $(this).closest('table').attr('id');
        var checked = $(this).is(':checked');

        if ($(this).data('name') != 'main') {
            parentId = $(this).closest('tr').data('id');
        }

        _checkedCheckbox(parentId, tableId, checked);
        _checkedObjects[tableId] = _getCheckedRows(tableId);
    });

})(jQuery, window, document);