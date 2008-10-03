var RD = RD || {};
RD.ui = {
  load_script: function( script_url ) {
    $('body').append( '<script src="' + script_url + '" type="text/javascript"></script>' );
  },
  show_badge: function( badge ) {
    $( badge.target ).html( badge.content );
  },
  after_load: function() {
    $('.js-hide').hide();
    $('.js-only').show();
  }
};
