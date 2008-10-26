var RD = RD || {};
RD.ui = {
  load_script: function( script_url ) {
    $('body').append( '<script src="' + script_url + '" type="text/javascript"></script>' );
  },
  show_badge: function( badge ) {
    $( badge.target ).html( badge.content );
  },
  remote_connect: function( base_url ) {
    if ( base_url === undefined ) { return function(){}; }
    var url_updater = function( attr_name ) {
        if( $(this).attr(attr_name).indexOf('http') !== 0 ) {
          $(this).attr(attr_name, base_url + $(this).attr(attr_name) );
        }
    };
    return function() {
      $('a', this).each( function() { url_updater.call( this, 'href' ) } );
      $('form', this).each( function() { url_updater.call( this, 'action' ) } );
    };
  },
  load_remote_select: function() {
    var self = this, meta = $(this).metadata();
    $.getJSON( meta.get + '.js?callback=?', { badge: 'select' }, function( response ) {
      $(self).hide().after( '<div class="remote_select_block"></div>')
            .next().html(response.content )
            .find('select').val( $(self).val() )
            .change( function() { 
              $(self).val($(this).val());   
              $(self).parent().find('.edit_select_target').trigger('refresh');
            } ); 
      $(self).parent().find('.edit_select_target').trigger('refresh');
    } );
  },
  after_load: function() {
    //$('.js-hide').hide();
    //$('.js-only').show();
  }
};
