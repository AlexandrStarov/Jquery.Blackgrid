(function ($, window, document) {
    $.grid = {};
    var _tables = {};

    function _loadNodes(data, tableId) {
        var iconCretRight = _getIconCaretRight();
        var emptyIcon = _getEmptyIcon();

        $.each(data, function (index, value) {
            if (value.parentId == null) {
                var icon = value.hasChildren ? iconCretRight : emptyIcon;
                var rowData = '<td>' + icon + ' ' + value.name + '</td>' +
                '<td>' + value.description + '</td>';

                $('#' + tableId + ' > tbody:last-child').append('<tr data-role="row" data-id="' + value.id + '">' + rowData + '</tr>').index('tr:first-child');
            }

        });
    }

    $.CreateGrid = function (id, url, columns) {
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
                $(document).trigger('DownloadSuccessful', [id, url]);
                _loadNodes(data, id);
            },
            dataType: "json"
        });
    };

    function _combineRow(parameters, paddingLeft, parentId) {
        paddingLeft += 14;
        var rowData;
        if (parameters.hasChildren) {
            rowData = '<td style="padding-left:' + paddingLeft + 'px;"><i class="fa fa-caret-right grid-icon"></i> ' +
                parameters.name + '</td>' + '<td>' + parameters.description + '</td>';
        } else {
            rowData = '<td style="padding-left:' + paddingLeft + 'px;">' + parameters.name + '</td>' +
                '<td>' + parameters.description + '</td>';
        }
        return '<tr data-role="row" data-id="' + parameters.id + '" data-parentId="' + parentId + '">' + rowData + '</tr>';
    }

    function _loadChildren(parent, url) {
        var padddingLeft = $('td:first', $(parent)).css('padding-left').replace(/[^-\d\.]/g, '');
        var parentId = $(parent).data('id');
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(parentId),
            success: function (data) {
                $.each(data, function (index, value) {
                    if (value.parentId === parentId) {
                        $(parent).after(_combineRow(value, parseInt(padddingLeft), $(parent).data('id')));
                    }
                });
            },
            dataType: "json"
        });


    }

    function _removeChildren(parentId) {
        $('tr[data-parentid="' + parentId + '"]').remove();
    }

    function _getIconCaretRight() {
        return '<i class="fa fa-caret-right grid-icon"></i>';
    };

    function _getEmptyIcon() {
        return '<i class="empty-icon"></i>';
    }
    
    $(document).on("click", 'i.grid-icon', function () {
        var tr$ = $(this).closest('tr');
        if ($(this).hasClass('fa-caret-right')) {
            $(this).removeClass('fa-caret-right').addClass('fa-caret-down');
            var tableId = $(this).closest('table').attr('id');
            _loadChildren(tr$, _tables[tableId].url);
        } else {
            $(this).removeClass('fa-caret-down').addClass('fa-caret-right');
            _removeChildren($(tr$).data('id'));
        }
    });
})(jQuery, window, document);