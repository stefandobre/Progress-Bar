function apexProgressBar(itemName){

    var progressBar = apexProgressBar.instances[itemName];

    var finish = function(){
        progressBar.$barElem.finish();
    };

    var stop = function(){
        progressBar.$barElem.stop(true);
    };

    var setValue = function(value){
        //depending on the option chosen by the user
        progressBar.$valNode.val(value);
    };

    var getValue = function(){
        return progressBar.$valNode.val();
    };

    var clear = function(){
        setValue();

        progressBar.$barElem.stop(true);
        progressBar.$barElem.css('width', '0%');
        progressBar.$prcElem.text('0%');
        progressBar.$msgElem.text('');
    };

    var setValues = function(values, options){
        //value = {percentage: number, message: string, duration: number, color: string, options: object}
        //lOptions = $.extend( lDefaults, pOptions );

        var valuesDefaults = {
            percentage: progressBar.currentPercentage,
            message: progressBar.currentMessage,
            color: 'rgb(64, 64, 64)', //progressBar.currentColor,
            duration: 500
        };

        var optionsDefaults = {
            immediate: false
        };

        values = $.extend(valuesDefaults, values);
        options = $.extend(optionsDefaults, options);

        if(options.immediate){
            stop();
        }

        progressBar.$barElem.animate(
            {
                width: values.percentage+'%',
                backgroundColor: values.color
            },
            {
                queue: !options.immediate,
                duration: values.duration,
                start: function(){
                    progressBar.$msgElem.text(values.message);
                },
                step: function(now, tween){
                    if(tween.prop == 'width'){
                        progressBar.$prcElem.text(Math.round(parseFloat(now))+'% ');
                    }
                },
                done: function(info){
                    if(info.props.width == '100%'){
                        progressBar.$valNode.trigger('pb-100-percent');
                    }
                }
            }
        );

        setValue(values.percentage + ':' + values.message);
        progressBar.currentPercentage = values.percentage;
        progressBar.currentMessage = values.message;
        progressBar.currentColor = values.color;

    };

    var show = function(){
        apex.item(itemName).show();
    };

    var hide =  function(){
        apex.item(itemName).hide();
    }

    if(progressBar){
        return {
            getValue: getValue,
            clear: clear,
            setValues: setValues,
            finish: finish,
            stop: stop,
            show: show,
            hide: hide
        };
    } else {
        return {
            init: function(options){
                apex.item.create(itemName, {
                    getValue: function() {
                        return apexProgressBar(itemName).getValue();
                    },
                    setValue: function( pValue, pDisplayValue ) {

                        //in case of "Clear", we don't show any animation
                        if(pValue == null || pValue == ''){
                            apexProgressBar(itemName).clear();
                            return;                            
                        }
                        
                        //in case pValue is a number, we make it a string
                        pValue = '' + pValue;
                        
                        //translating the new value into percentage, message, and an optional animation duration

                        var data = pValue.split(':');
                        var percentage = data[0];
                        var message = data[1];
                        var duration = data[2];
                        
                        if(!percentage && percentage != 0){
                            percentage = 0;
                        } else {
                            percentage = parseInt(percentage);
                        }
                        
                        if(percentage < 0 || percentage > 100){
                            throw new Error('Progress Bar percentage must be between 0 and 100');
                        }
                        
                        if(!duration && duration != '0'){
                            duration = 500;
                        } else {
                            duration = parseInt(duration);
                        }
                        
                        //setting the internal item value
                        //this.node.value = percentage + (message ? (':' + message) : '');

                        apexProgressBar(itemName).setValues({
                            percentage: percentage,
                            message: message,
                            duration: duration
                        });
                    }
                });

                if(options.isHidden){
                    apex.item(itemName).hide();
                }

                apexProgressBar.instances[itemName] = {
                    apexItem: apex.item(itemName),
                    $valNode: $('#' + itemName),
                    $barElem: $('#' + itemName + '-wrapper .pb-bar'),
                    $prcElem: $('#' + itemName + '-wrapper .pb-label-percentage'),
                    $msgElem: $('#' + itemName + '-wrapper .pb-label-message'),

                    initialValue: '',
                    initialPercentage: '',
                    initialMessage: '',
                    initialColor: '',

                    currentValue: '',
                    currentPercentage: '',
                    currentMessage: '',
                    currentColor: ''
                };

            }
        };
    }
}

apexProgressBar.instances = {};