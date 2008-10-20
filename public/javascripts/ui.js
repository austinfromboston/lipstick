var RD = RD || {};
RD.ui = {
  load_script: function( script_url ) {
    $('body').append( '<script src="' + script_url + '" type="text/javascript"></script>' );
  },
  show_badge: function( badge ) {
    $( badge.target ).html( badge.content );
  },
  remote_connect: function( base_url, attr_name ) {
    return function() {
      if( $(this).attr(attr_name).indexOf('http') !== 0 ) {
        $(this).attr(attr_name, base_url + $(this).attr(attr_name) );
      }
    };
  },
  after_load: function() {
    //$('.js-hide').hide();
    //$('.js-only').show();
  }
};
