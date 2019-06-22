function apexProgressBar(itemName){

    var progressBar = apexProgressBar.instances[itemName];

    var finish = function(){
        progressBar.$barElem.finish();
    };

    var stop = function(){
        progressBar.$barElem.stop(true);
    };

    var setValue = function(values){

        var val = '';
        if(!values){
            val = '0';
        } else {
            if(values.percentage){
                val = '' + values.percentage;
            }
            if(values.message){
                val = (val ? (val + ':' + values.message) : values.message);
            }
        }

        progressBar.$valNode.val(val);
    };

    var getValue = function(){
        return progressBar.$valNode.val();
    };

    var getPercentage = function(){
        return progressBar.currentPercentage;
    };

    var getMessage = function(){
        return progressBar.currentMessage;
    };

    var getColor = function(){
        return progressBar.currentColor;
    };

    var clear = function(){
        setValue();

        progressBar.$barElem.stop(true);
        progressBar.$barElem.css('width', '0%');
        progressBar.$prcElem.text('0%');
        progressBar.$msgElem.text('');
    };

    var setValues = function(values, options){

        //defaults
        var valuesDefaults = {
            percentage: progressBar.currentPercentage,
            message:    progressBar.currentMessage,
            color:      progressBar.currentColor,
            duration:   500
        };

        var optionsDefaults = {
            immediate:  false
        };

        values =  $.extend(valuesDefaults,  values);
        options = $.extend(optionsDefaults, options);

        //validations
        if(!values.percentage && values.percentage != 0){
            percentage = 0;
        } else {
            values.percentage = parseInt(values.percentage);
        }
        
        if(values.percentage < 0 || values.percentage > 100){
            throw new Error('Progress Bar percentage must be between 0 and 100');
        }

        values.duration = parseInt(values.duration);

        if(values.duration < 0){
            throw new Error('Animation duration cannot be less than 0 milliseconds');
        }

        //if immediate, stop animation pending animations and perform this one
        if(options.immediate){
            stop();
        }

        //perform the animation
        progressBar.$barElem.animate(
            {
                width: values.percentage + '%',
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

        setValue({percentage: values.percentage, message: values.message});
        progressBar.currentPercentage = values.percentage;
        progressBar.currentMessage    = values.message;
        progressBar.currentColor      = values.color;

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
            getPercentage: getPercentage,
            getMessage: getMessage,
            getColor: getColor,
            clear: clear,
            setValues: setValues,
            finish: finish,
            stop: stop,
            show: show,
            hide: hide
        };
    } else {
        return {
            init: function(initialValues, options){

                apex.item.create(itemName, {
                    getValue: function() {
                        return apexProgressBar(itemName).getValue();
                    },
                    setValue: function( pValue, pDisplayValue ) {

                        //in case of "Clear"
                        if(pValue == null || pValue == ''){
                            apexProgressBar(itemName).clear();
                            return;                            
                        }

                        //splitting into percentage, message, and an optional animation duration
                        var data = pValue.toString().split(':');
                        var percentage = data[0];
                        var message = data[1];
                        var duration = data[2];

                        apexProgressBar(itemName).setValues({
                            percentage: percentage,
                            message: message,
                            duration: duration
                        });
                    }
                });

                if(options.hidden){
                    apex.item(itemName).hide();
                }

                apexProgressBar.instances[itemName] = {
                    apexItem: apex.item(itemName),
                    $valNode: $('#' + itemName),
                    $barElem: $('#' + itemName + '-wrapper .pb-bar'),
                    $prcElem: $('#' + itemName + '-wrapper .pb-label-percentage'),
                    $msgElem: $('#' + itemName + '-wrapper .pb-label-message'),

                    initialValue:      initialValues.value,
                    initialPercentage: initialValues.percentage,
                    initialMessage:    initialValues.message,
                    initialColor:      initialValues.color,

                    currentPercentage: initialValues.percentage,
                    currentMessage:    initialValues.message,
                    currentColor:      initialValues.color
                };
            }
        };
    }
}

apexProgressBar.instances = {};