/**
 * windowName transport plugin for jQuery
 *
 * Thanks to Kris Zyp <http://www.sitepen.com/blog/2008/07/22/windowname-transport/>
 * for the original idea and some code
 *
 * Licensed under GPLv3: http://www.gnu.org/licenses/gpl-3.0.txt
 * @author Marko Mrdjenovic <jquery@friedcellcollective.net>
 *
**/
(function () {
	var $ = window.jQuery,
		origAjax = $.ajax,
		frameCounter = 0;
	$.extend({
		ajax: function (s) {
			var remote = /^(?:\w+:)?\/\/([^\/?#]+)/,
				data = '', status = '', requestDone = false,
				xhr = null, type = null, ival = setTimeout(function () {}, 0),
				onreadystatechange = null, success = null, complete = null,
				localdom = remote.exec(s.url);
			if (s.type === 'POST' && localdom && localdom[1] !== location.host) { // when posting to a remote location use window.name transport
				xhr = function () {
					var url = '',
						frameName = '',
						frame = '',
						defaultName = 'jQuery.windowName.transport.frame',
						u = null;
					function cleanup() {
						try {
							delete window[frameName + '-callback'];
						} catch (er) {
							window[frameName + '-callback'] = function () {};
						}
						setTimeout(function () {
							$(frame).remove();
						}, 100);
					}
					function setData() {
						try {
							var data = frame.contentWindow.name;
							if (typeof data === 'string') {
								if (data === defaultName) {
									u.status = 501;
									u.statusText = 'Not Implemented';
								} else {
									u.status = 200;
									u.statusText = 'OK';
									u.responseText = data;
								}
								u.readyState = 4; // we are done now
								u.onreadystatechange();
								cleanup();
							}
						} catch (er) {}
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
							frameCounter += 1;
							frameName = "jQuery.ajax.windowName." + ('' + Math.random()).substr(2, 8);
							var form = document.createElement('form'),
								ival = setTimeout(function () {}, 1);
							frame = document.createElement($.browser.msie? '<iframe name="' + frameName + '">' : 'iframe');
							frame.style.display = 'none';
							window[frameName + '.callback'] = frame.onload = function (interval) {
								var local = window.location.href.substr(0, window.location.href.indexOf('/', 8)) + '/robots.txt';
								function is_local() {
									var c = false;
									try {
										c = !!frame.contentWindow.location.href;
										// try to get location - if we can we're still local and have to wait some more...
									} catch (er) {
										// if we're at foreign location we're sure we can proceed
									}
									return c;
								}
								try {
									if (frame.contentWindow.location.href === 'about:blank') {
										return;
									}
								} catch (er) {}
								if (u.readyState === 3 && is_local()) {
									clearInterval(ival);
									setData();
								}
								if (u.readyState === 2 && !is_local()) {
									u.readyState = 3;
									u.onreadystatechange();
									frame.contentWindow.location = local;
								}
							};
							ival = setInterval(function () {
								window[frameName + '.callback'](true);
							}, 17);
							setTimeout(function () { // stop after 2 mins
								clearTimeout(ival);
								cleanup();
							}, 120000);
							frame.name = frameName;
							frame.id = frameName;
							$('body')[0].appendChild(frame);
							// prepare form
							function queryToObject(q) {
								var r = {},
									d = decodeURIComponent;
								$.each(q.split("&"), function (k, v) {
									if (v.length) {
										var parts = v.split('='),
											n = d(parts.shift()),
											curr = r[n];
										v = d(parts.join('='));
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
							}
							document.getElementsByTagName('body')[0].appendChild(form);
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
							this.readyState = 2;
							this.onreadystatechange();
							form.parentNode.removeChild(form);
							if (frame.contentWindow) {
								frame.contentWindow.name = defaultName;
							}
						},
						setRequestHeader: function (key, value) {
						},
						onreadystatechange: function () {},
						readyState: 0,
						responseText: '',
						responseXML: null,
						status: null,
						statusText: null
					};
					return u;
				}();
				type = s.type.toUpperCase();

				s = $.extend(true, s, $.extend(true, {}, $.ajaxSettings, s));
				if (s.data && s.processData && typeof s.data !== 'string') {
					s.data = $.param(s.data);
				}

				xhr.open(type, s.url);

				if (s.beforeSend && s.beforeSend(xhr, s) === false) {
					if (s.global) {
						$.active -= 1;
					}
					xhr.abort();
					return false;
				}
				if (s.global) {
					$.event.trigger("ajaxSend", [xhr, s]);
				}
				
				onreadystatechange = function (isTimeout) {
					if (!requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout")) {
						requestDone = true;
						if (ival) {
							clearInterval(ival);
							ival = null;
						}
						status = isTimeout === 'timeout' && 'timeout' || !$.httpSuccess(xhr) && "error" || 'success';
						if (status === 'success') {
							try {
								data = $.httpData(xhr, s.dataType, s.dataFilter);
							} catch (er) {
								status = 'parsererror';
							}
						}
						if (status === 'success') {
							success();
						} else {
							$.handleError(s, xhr, status);
						}
						complete();
						xhr = null;
					}
				};

				ival = setInterval(onreadystatechange, 13);
				if (s.timeout > 0) {
					setTimeout(function () {
						if (xhr) {
							xhr.abort();
							if (!requestDone) {
								onreadystatechange("timeout");
							}
						}
					}, s.timeout);
				}
				try {
					xhr.send(s.data);
				} catch (er) {
					$.handleError(s, xhr, null, er);
				}

				success = function () {
					if (s.success) {
						s.success(data, status);
					}
					if (s.global) {
						$.event.trigger('ajaxSuccess', [xhr, s]);
					}
				};

				complete = function () {
					if (s.complete) {
						s.complete(xhr, status);
					}
					if (s.global) {
						$.event.trigger('ajaxComplete', [xhr, s]);
					}
					$.active -= 1;
					if (s.global && !$.active) {
						$.event.trigger('ajaxStop');
					}
				};

				return xhr;
			} else {
				return origAjax.apply(this, arguments);
			}
		}
	});
})();
