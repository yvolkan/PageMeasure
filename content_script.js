var CONTENT = {
    containerID: 'vyzRuleContainer',
    pageX1: null,
    pageY1: null,
    container: null,
    drawRectangle: false,
    rectangleID: 'vyzRuleRectangle',
    exists: function () {
        return $('#' + this.containerID).length;
    },
    remove: function () {
        $('#' + this.containerID).remove();
        $('.vyzRuleOverlay').remove();
        $('.vyzRuleBar').remove();
        $('body').attr('style', '');
    },
    append: function (target, html) {
        $(target).append(html);
    },
    setColor: function (color) {
        localStorage.setItem('vyzRuleStyleBg', $('#vyzRuleColorPicker').css('backgroundColor'));
    },
    draw: function (vyzRectangleWidth, vyzRectangleHeight, y1, x1) {
        console.log(localStorage.getItem('vyzRuleStyleBg'));
        console.log(localStorage.getItem('vyzRuleStyleBg').replace(/[^,]+(?=\))/, '0.4'));
        $('#' + this.rectangleID).css({
            'width': vyzRectangleWidth,
            'height': vyzRectangleHeight,
            'top': y1,
            'left': x1,
            'backgroundColor': localStorage.getItem('vyzRuleStyleBg').replace(')', ', 0.4)').replace('rgb', 'rgba'),
        });

        var vyzRectangleLeft = x1,
            vyzRectangleTop  = y1,
            vyzRectangleRight = (document.body.scrollWidth - (vyzRectangleLeft + vyzRectangleWidth));

        $('#vyzRuleWidthLabel').attr('data-old', vyzRectangleWidth);
        $('#vyzRuleWidthLabel').val(vyzRectangleWidth);

        $('#vyzRuleHeightLabel').attr('data-old', vyzRectangleHeight);
        $('#vyzRuleHeightLabel').val(vyzRectangleHeight);

        $('#vyzRuleLeftLabel').attr('data-old', vyzRectangleLeft);
        $('#vyzRuleLeftLabel').val(vyzRectangleLeft);

        $('#vyzRuleTopLabel').attr('data-old', vyzRectangleTop);
        $('#vyzRuleTopLabel').val(vyzRectangleTop);

        $('#vyzRuleRightLabel').attr('data-old', vyzRectangleRight);
        $('#vyzRuleRightLabel').val(vyzRectangleRight);

        $('#vyzRuleBottomtLabel').attr('data-old', vyzRectangleHeight + vyzRectangleTop);
        $('#vyzRuleBottomtLabel').val(vyzRectangleHeight + vyzRectangleTop);
    },
    load: function () {
        var _this = this;

        if (!localStorage.getItem('vyzRuleStyleBg')) {
            localStorage.setItem('vyzRuleStyleBg', 'rgb(133, 255, 89)');

        }

        $('body').attr('style', 'transform: translateY(30px) !important;');
        _this.container = $('<div style="width: ' + document.body.scrollWidth + 'px !important; height: ' + document.body.scrollHeight + 'px;" class="vyzRuleContainer" id="' + _this.containerID + '"></div>');
        _this.append('html', _this.container);
        _this.append('html', $('<div class="vyzRuleOverlay"></div>'));
        _this.append('html',
            $('<div class="vyzRuleBar">' +
                '<table class="vyzRuleTable">' +
                    '<tr>' +
                        '<td>Width: <input type="number" class="vyzRuleRectangleBox" id="vyzRuleWidthLabel"/> px</td>' +
                        '<td>Height: <input type="number" class="vyzRuleRectangleBox" id="vyzRuleHeightLabel" /> px</td>' +
                        '<td>Left: <input type="number" class="vyzRuleRectangleBox" id="vyzRuleLeftLabel" /> px</td>' +
                        '<td>Top: <input type="number" class="vyzRuleRectangleBox" id="vyzRuleTopLabel" /> px</td>' +
                        '<td>Right: <input type="number" class="vyzRuleRectangleBox" id="vyzRuleRightLabel" /> px</td>' +
                        '<td>Bottom: <input type="number" class="vyzRuleRectangleBox" id="vyzRuleBottomtLabel" /> px</td>' +
                        '<td>Pick Color: <button id="vyzRuleColorPicker" style="width:30px; height:20px;"></button>' +
                    '</tr>' +
                '</table>' +
            '</div>'));
        _this.append(_this.container, $('<div id="' + _this.rectangleID + '"></div>'));

        var picker = new jscolor(document.getElementById('vyzRuleColorPicker'), {
            valueElement:null,
            value: localStorage.getItem('vyzRuleStyleBg'),
            zIndex: 999999,
            fixed: true,
            onFineChange: _this.setColor
        });

        $('.vyzRuleRectangleBox').on('change mouseup keyup', function () {
            if ($(this).prop('id') == 'vyzRuleRightLabel') {
                var numberDiff = parseInt($(this).val()) - parseInt($(this).attr('data-old'));
                $('#vyzRuleLeftLabel').val(parseInt($('#vyzRuleLeftLabel').val()) - numberDiff);
            } else if ($(this).prop('id') == 'vyzRuleBottomtLabel') {
                var numberDiff = parseInt($(this).val()) - parseInt($(this).attr('data-old'));
                $('#vyzRuleTopLabel').val(parseInt($('#vyzRuleTopLabel').val()) - numberDiff);
            }

            _this.draw(parseInt($('#vyzRuleWidthLabel').val()),
                parseInt($('#vyzRuleHeightLabel').val()),
                parseInt($('#vyzRuleTopLabel').val()),
                parseInt($('#vyzRuleLeftLabel').val())
            );
        });

        $('#' + _this.containerID)
            .on('mousedown', function(e) {
                _this.pageX1 = e.pageX;
                _this.pageY1 = e.pageY;

                _this.drawRectangle = true;
                $('body.vyzRule').removeClass('vyzDrawed');
                $('body.vyzRule').addClass('vyzDraw');
            })
            .on('mouseup', function (e) {
                _this.drawRectangle = false;
                $('body.vyzRule').removeClass('vyzDraw');
                $('body.vyzRule').addClass('vyzDrawed');
            })
            .on('mousemove', function (e) {
                if (_this.drawRectangle) {
                    _this.pageX2 = e.pageX;
                    _this.pageY2 = e.pageY;

                    var calcX1 = _this.pageX1;
                    var calcY1 = _this.pageY1;

                    if (_this.pageX2 - _this.pageX1 < 0) {
                        calcX1 = e.pageX;
                        _this.pageX2 = _this.pageX1;
                    }

                    if (_this.pageY2 - _this.pageY1 < 0) {
                        calcY1 = e.pageY;
                        _this.pageY2 = _this.pageY1;
                    }

                    var vyzRectangleWidth = _this.pageX2 - calcX1;
                    if (vyzRectangleWidth < 0) {
                        vyzRectangleWidth = vyzRectangleWidth * -1;
                    }

                    var vyzRectangleHeight = _this.pageY2 - calcY1;
                    if (vyzRectangleHeight < 0) {
                        vyzRectangleHeight = vyzRectangleHeight * -1;
                    }

                    _this.draw(vyzRectangleWidth, vyzRectangleHeight, calcY1, calcX1);
                }
            });


        window.addEventListener("keydown", function(e) {
            if (_this.exists() && [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }

            if (e.shiftKey) {
                switch (e.keyCode) {
                    case 38:
                        $('#vyzRuleHeightLabel').val(parseInt($('#vyzRuleHeightLabel').val()) - 1);
                        $('#vyzRuleHeightLabel').change();
                    break;

                    case 40:
                        $('#vyzRuleHeightLabel').val(parseInt($('#vyzRuleHeightLabel').val()) + 1);
                        $('#vyzRuleHeightLabel').change();
                    break;

                    case 37:
                        $('#vyzRuleWidthLabel').val(parseInt($('#vyzRuleWidthLabel').val()) - 1);
                        $('#vyzRuleWidthLabel').change();
                    break;

                    case 39:
                        $('#vyzRuleWidthLabel').val(parseInt($('#vyzRuleWidthLabel').val()) + 1);
                        $('#vyzRuleWidthLabel').change();
                    break;
                }
            } else {
                switch (e.keyCode) {
                    case 38:
                        $('#vyzRuleTopLabel').val(parseInt($('#vyzRuleTopLabel').val()) - 1);
                        $('#vyzRuleTopLabel').change();
                    break;

                    case 40:
                        $('#vyzRuleTopLabel').val(parseInt($('#vyzRuleTopLabel').val()) + 1);
                        $('#vyzRuleTopLabel').change();
                    break;

                    case 37:
                        $('#vyzRuleLeftLabel').val(parseInt($('#vyzRuleLeftLabel').val()) - 1);
                        $('#vyzRuleLeftLabel').change();
                    break;

                    case 39:
                        $('#vyzRuleLeftLabel').val(parseInt($('#vyzRuleLeftLabel').val()) + 1);
                        $('#vyzRuleLeftLabel').change();
                    break;
                }
            }
        }, false);
    }
};

if (CONTENT.exists()) {
    CONTENT.remove();
} else {
    CONTENT.load();
}