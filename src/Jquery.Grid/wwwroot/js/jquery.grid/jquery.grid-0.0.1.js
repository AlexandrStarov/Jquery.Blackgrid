(function ($, window, document) {
    $.BlackGrid = {};
    var _tables = {};

    function _loadTreeGrid(data, tableId) {
        var headDictionary = _getHeadDictionary($('#' + tableId).attr('id'))
        $.each(data, function (index, value) {
            if (value.parentId == null) {
                var tr = _combineRow(value, 0, null, headDictionary);
                $('#' + tableId + ' > tbody:last-child').append(tr).index('tr:first-child');
            }

        });
    }

    $.BlackGrid.Create = function (id, url, columns) {
        var cells = '';
        tableId = id;
        _tables[id] = {
            "url": url,
            "columns": columns
        };

        $.each(columns, function (index, value) {
            cells += '<td data-name="' + this.name + '" style="width: ' + this.width + 'px">' + this.text + '</td>\n';
        });

        $('#' + id).html('<thead><tr>' + cells + '</tr></thead><tbody></tbody>');

        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(null),
            success: function (data) {
                $(document).trigger('BlackGrid_DownloadSuccessful', [id, url]);
                _loadTreeGrid(data, id);
            },
            dataType: "json"
        });
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
        var icon = data.hasChildren ? _getIconCaretRight() : _getEmptyIcon();
        paddingLeft += 14;
        var rowData = '';

        $.each(headDictionary, function (key, value) {
            if (value == 0) {
                rowData += '<td style="padding-left:' + paddingLeft + 'px;">' + icon + ' ' + data[key] + '</td>'
            } else {
                rowData += '<td>' + data[key] + '</td>'
            }
        });

        return '<tr data-role="row" data-id="' + data.id + '" data-parentId="' + parentId + '" data-haschildren="' + data.hasChildren + '">' + rowData + '</tr>';
    }

    function _loadChildren(parent$, url) {
        var padddingLeft = $('td:first', $(parent$)).css('padding-left').replace(/[^-\d\.]/g, '');
        var parentId = $(parent$).data('id');
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(parentId),
            success: function (data) {
                var headDictionary = _getHeadDictionary($(parent$).closest('table').attr('id'))
                $.each(data, function (index, value) {
                    if (value.parentId === parentId) {
                        $(parent$).after(_combineRow(value, parseInt(padddingLeft), $(parent$).data('id'), headDictionary));
                    }
                });
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
        return '<i class="fa fa-caret-right grid-icon"></i>';
    };

    function _getEmptyIcon() {
        return '<i class="empty-icon"></i>';
    }

    $(document).on("click", 'i.grid-icon', function () {
        var tr$ = $(this).closest('tr');
        var tableId = $(this).closest('table').attr('id');

        if ($(this).hasClass('fa-caret-right')) {
            $(this).removeClass('fa-caret-right').addClass('fa-caret-down');
            _loadChildren(tr$, _tables[tableId].url);
        } else {
            $(this).removeClass('fa-caret-down').addClass('fa-caret-right');
            _removeChildren($(tr$).data('id'), tableId);
        }
    });

    $(document).on("click", "tr", function () {

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