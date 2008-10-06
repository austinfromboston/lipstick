/**
 * windowName transport plugin for jQuery
 *
 * Thanks to Kris Zyp <http://www.sitepen.com/blog/2008/07/22/windowname-transport/>
 * for the original idea and some code
 *
 * Licensed under GPLv3: http://www.gnu.org/licenses/gpl-3.0.txt
 * @author Marko Mrdjenovic <jquery@friedcellcollective.net>
 * 
 * @author Austin Putman <austin hat radicaldesigns dhot org>
 * This version has been extended to work on Firefox 3 with jQuery > 1.2.6
 * you will need to patch your version of jquery 1.2.6 to use this script
 * the patch can be found here: http://gist.github.com/14809
 * UNTESTED with all other browsers, may or may not expose you to as-yet-undiscovered
 * security exploits, contents may explode under pressure
 * 
**/
(function () {
    var $ = window.jQuery,
        _ajax = $.ajax;
    $.extend({
        ajax: function (s) {
            var remote = /^(?:\w+:)?\/\/([^\/?#]+)/,
                localdom = remote.exec(s.url);
            if ( localdom && localdom[1] !== location.host) { 
                // indicate our desire for window.name communication
                s.url += (s.url.match(/\?/) ? '&' : '?') + "windowname=" + (s.authElement ? "auth" : true);

                // when targetting a remote location use window.name transport
                s.xhr = function () {
                    var url = '',
                        frameName = '',
                        frame = '',
                        defaultName = 'jQuery.windowName.transport.frame',
                        u = null;

                    function cleanup() {
                        if (u.frameCounter !== undefined ) {
                          //try {
                          //  delete jQuery.ajax.windowName[jQuery.ajax.windowName._frameCounter];
                          //} catch (er) {
                          //    jQuery.ajax.windowName[u.frameCounter] = function () {};
                          //}
                        }
                        setTimeout(function () {
                            $(frame).remove();
                        }, 100);
                    }

                    function setData() {
                        try {
                            var data = frame.contentWindow.name;
                            if (typeof data === 'string') {
                                if (data === frameName) {
                                    u.status = 501;
                                    u.statusText = 'Not Implemented';
                                } else {
                                    u.status = 200;
                                    u.statusText = 'OK';
                                    u.responseText = data;
                                }
                                // all data received
                                u.readyState = 4; // we are done now
                                u.onreadystatechange();
                                cleanup();
                            }
                        } catch (er) {
                        }
                    }

                    u = {
                        abort: function () {
                            cleanup();
                        },
                        getAllResponseHeaders: function () {
                            return '';
                        },
                        getResponseHeader: function (key) {
                            return '';
                        },
                        open: function (m, u) {
                            url = u;
                            this.readyState = 1;
                            this.onreadystatechange();
                        },
                        send: function (data) {
                            // prepare frame
                            var frameCounter = this.frameCounter = jQuery.ajax.windowName._frameCounter++;
                            frameName = window.location.href.substr(0, window.location.href.indexOf('/', 8)) + '/robots.txt' + '#' + frameCounter;
                            frame = document.createElement($.browser.msie? '<iframe name="' + frameName + '" onload="jQuery.ajax.windowName['+frameCounter+']()">' : 'iframe');
                            frame.style.display = 'none';
                            function styleFrame(frame ) {
                              frame.style.width  = '100%';
                              frame.style.height = '100%';
                              frame.style.border = '0px';
                            }
                            styleFrame(frame);

                            //frame.onload callback
                            $.ajax.windowName[frameCounter]  = frame.onload = function () {
                                var local = window.location.href.substr(0, window.location.href.indexOf('/', 8)) + '/robots.txt';
                                try {
                                    if (frame.contentWindow.location.href === 'about:blank') {
                                        return;
                                    }
                                } catch (er) {}
                                if (u.readyState === 2 ) {
                                    //waiting for data
                                    u.readyState = 3;
                                    u.onreadystatechange();
                                    // this will fail in opera when both domains are https
                                    // workarounds would be welcome
                                    frame.contentWindow.location = local;
                                }
                                try {
                                  if (u.readyState === 3 ) {
                                      //redirect completed, data should be ready
                                      setData();
                                  }
                                }
                                catch(e){
                                }
                            };



                            frame.name = frameName;
                            frame.id = frameName;
                            $('body')[0].appendChild(frame);
                            if( s.type.match(/GET/i)) {
                              if(s.data && s.data.length) {
                                s.url += ( s.url.indexOf("?") == -1 ? "?" : "&" ) + s.data;
                              }
                              frame.src = s.url;
                              if( frame.contentWindow ) {
                                frame.contentWindow.location.replace(s.url);
                              }
                              this.readyState = 2;
                              this.onreadystatechange();
                            } else if( s.type.match(/POST/i)) {
                              // prepare form
                              var form = document.createElement('form');
                              var queryToObject = function (q) {
                                  var r = {},
                                      d = decodeURIComponent;
                                  function dd( value ) { return value.replace(/\+/g, "%20" );  }
                                  $.each(q.split("&"), function (k, v) {
                                      if (v.length) {
                                          var parts = v.split('='),
                                              n = d(dd(parts.shift())),
                                              curr = r[n];
                                          v = d(dd(parts.join('=')));
                                          if (typeof curr === 'undefined') {
                                              r[n] = v;
                                          } else {
                                              if (curr.constructor === Array) {
                                                  r[n].push(v);
                                              } else {
                                                  r[n] = [curr].concat(v);
                                              }
                                          }
                                      }
                                  });
                                  return r;
                              };
                              $('body')[0].appendChild(form);
                              $.each(queryToObject(data), function (k, v) {
                                  function setVal(k, v) {
                                      var input = document.createElement("input");
                                      input.type = 'hidden';
                                      input.name = k;
                                      input.value = v;
                                      form.appendChild(input);
                                  }
                                  if (v.constuctor === Array) {
                                      $.each(v, function (i, v) {
                                          setVal(k, v);
                                      });
                                  } else {
                                      setVal(k, v);
                                  }
                              });
                              form.method = 'POST';
                              form.action = url;
                              form.target = frameName;
                              frame.contentWindow.location = 'about:blank'; // opera likes this
                              form.submit();
                              //request sent
                              this.readyState = 2;
                              this.onreadystatechange();
                              form.parentNode.removeChild(form);
                            }
                            if (frame.contentWindow) {
                                frame.contentWindow.name = frameName;
                            }
                            setTimeout(function () { // stop after 2 mins
                                cleanup();
                            }, 120000);
                        },
                        setRequestHeader: function (key, value) {
                        },
                        onreadystatechange: function () {},
                        readyState: 0,
                        responseText: '',
                        responseXML: null,
                        status: null,
                        statusText: null,
                        frameCounter: null
                    };
                    return u;
                };
            }
            return _ajax( s );
        }
    });
    jQuery.ajax.windowName = jQuery.ajax.windowName || [];  
    jQuery.ajax.windowName._frameCounter = 0;
})();
