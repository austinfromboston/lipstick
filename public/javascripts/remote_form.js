//define the RD object unless it already exists
//if( RD === undefined ) { var RD = function() { return { }; }; }
var RD = RD || {};

RD.remote_form = function( extension ) {
  //create a blank object to perform the extension if no extension is passed
  //if ( extension === undefined ) { var extension = {}; }
  var extension = extension || {};
  return $.extend( {
    submit: function( format ) {

      //any wysiwyg editors should save data to their associated text areas
      //tinyMCE.triggerSave();

      //request_format is the extension to place on the form's action attribute
      var request_format = '';
      if( format !== undefined ) { request_format = '.' + format; };

      //this refers to a form tag
      var url = $(this).attr('action') + request_format;
      var data = $(this).serializeArray();
      data[ data.length ] = { name: "windowname", value: true };
      //associate the current context to a local variable for use in the response callback
      var self = this;

      //post the form
      $.post( url, data, function(response) { $(self).fn('response', response )}, format  );

      //disable the standard submit event propagation
      return false;
    },

    //placeholder method to be overridden
    response: function( response ) {
    }
  }, extension );
};

