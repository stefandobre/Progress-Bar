procedure render
    ( p_item   in            apex_plugin.t_page_item
    , p_plugin in            apex_plugin.t_plugin
    , p_param  in            apex_plugin.t_item_render_param
    , p_result in out nocopy apex_plugin.t_item_render_result
    )
as
    l_escaped_value  varchar2(32767) := apex_escape.html(p_param.value);
    
    l_percentage     varchar2(32767);
    l_message        varchar2(32767);
    
    l_position       varchar2(100) := p_item.attribute_01;
    l_size_class     varchar2(100) := p_item.attribute_04;
    l_hex_color      varchar2(100) := p_item.attribute_05;
    l_style_class    varchar2(100) := p_item.attribute_08;
    
    l_percentage_on_bar    boolean := p_item.attribute_06 = 'onbar';
    l_percentage_under_bar boolean := p_item.attribute_06 = 'underbar';

    l_message_on_bar       boolean := p_item.attribute_07 = 'onbar';
    l_message_under_bar    boolean := p_item.attribute_07 = 'underbar';
    
    l_html                 varchar2(32767);
    l_onBarLabel           varchar2(32767);
    l_underBarLabel        varchar2(32767);
    
    l_isHidden             boolean := instr(p_item.attribute_09, 'hidden') > 0;
    
    procedure getValues
        ( p_value      in out varchar2
        , p_percentage    out varchar2
        , p_message       out varchar2
        )  
    as
    begin

        -- null  -> 0
        -- xy    -> xy
        -- :msg  -> 0:msg
        -- 2:msg -> 2:msg

        if p_value is null then
            p_value      := 0;
            p_percentage := 0;
        elsif instr(p_value, ':') = 0 then
            p_percentage := p_value;
        elsif instr(p_value, ':') = 1 then
            p_percentage := 0;
            p_message := p_value;
        else
            p_percentage := substr(p_value, 1, instr(p_value, ':')-1);
            p_message    := substr(p_value, instr(p_value, ':')+1);
        end if;

    end;

begin

    apex_plugin_util.debug_page_item
        ( p_plugin     => p_plugin
        , p_page_item  => p_item
        );
        
    getValues
        ( p_value      => l_escaped_value
        , p_percentage => l_percentage
        , p_message    => l_message
        );

    apex_javascript.add_library
        ( p_name       => 'script#MIN#'
        , p_directory  => nvl(:G_APEX_NITRO_PROGRESS_BAR, p_plugin.file_prefix) || 'js/'
        );

    apex_css.add_file
        ( p_name       => 'style#MIN#'
        , p_directory  => nvl(:G_APEX_NITRO_PROGRESS_BAR, p_plugin.file_prefix) || 'css/'
        );

    apex_javascript.add_onload_code
        ( p_code => 'apexProgressBar("' || p_item.name || '").init({ isHidden:' || case when l_isHidden then 'true' else 'false' end || '});'
        );

    l_html := q'[
                <div class="pb-outer" id="@itemName@-wrapper">
                    <input id="@itemName@" type="hidden" name="@itemName@" value="@escapedValue@"></input>
                    <div class="pb-progress @sizeClass@">
                        <span class="pb-bar @styleClass@" style="background-color: @hexColor@; width:@percentage@%;"></span>
                        @onBarLabel@
                    </div>
                    @underBarLabel@
                </div>
              ]';

    l_onBarLabel := case when l_percentage_on_bar or l_message_on_bar then
                        '<div class="pb-label-onbar">' ||
                            case when l_percentage_on_bar then
                                '<span class="pb-label-percentage">@percentage@% </span>'
                            end ||
                            case when l_message_on_bar then
                                '<span class="pb-label-message">@message@</span>'
                            end ||
                        '</div>'
                    end;
                    
    l_underBarLabel := case when l_percentage_under_bar or l_message_under_bar then
                            '<div class="pb-label-underbar">' ||
                                case when l_percentage_under_bar then
                                    '<span class="pb-label-percentage">@percentage@% </span>'
                                end ||
                                case when l_message_under_bar then
                                    '<span class="pb-label-message">@message@</span>'
                                end ||
                            '</div>'
                        end;

    l_html := replace(l_html, '@itemName@',      p_item.name);
    l_html := replace(l_html, '@sizeClass@',     l_size_class);
    l_html := replace(l_html, '@escapedValue@',  l_escaped_value);
    l_html := replace(l_html, '@hexColor@',      l_hex_color);
    l_html := replace(l_html, '@styleClass@',    l_style_class);
    l_html := replace(l_html, '@onBarLabel@',    l_onBarLabel);
    l_html := replace(l_html, '@underBarLabel@', l_underBarLabel);
    l_html := replace(l_html, '@percentage@',    l_percentage);
    l_html := replace(l_html, '@message@',       l_message);
    
    if l_position = 'floatingonbody' then
        apex_css.add
            ( p_css => '#' || p_item.name || '_CONTAINER .t-Form-labelContainer{ display: none; }' ||
                       '#' || p_item.name || '_CONTAINER .t-Form-inputContainer{ padding: 0; }'
            , p_key => 'hideItemWrapper-' || p_item.name
            );
        l_html := '<div class="pb-overlay pb-overlay-fixed"><div class="pb-body">' || l_html || '</div></div>';
    end if;
    
    htp.p(l_html);

end render;