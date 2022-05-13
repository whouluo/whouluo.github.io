! function(t) {
	function i(t, i) {
		this.init(t, i)
	}
	i.prototype = {
		init: function(i, n) {
			this.ele = i, this.opts = t.extend({}, {
					baseUrl: null,
					sign: null,
					log_id: null,
					generalizeId: null,
					openid: null,
					info: {}
				}, n), this.opts.log_id && this.send()
		},
		send: function() {
			this.fui();
			// if (this.iswx()) {
			// 	$('.jfb_created_img').css('display', 'block');
			// } else {
			// 	$('.jfb_created_img').css('display', 'none');
			// }
		},
		pqs: function (key) {
			var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null){
				return unescape(r[2]);
			}
			return null;
		},
		u: function () {
		    return /windows phone/i.test(navigator.userAgent) ? 
					 "Windows Phone" : 
					 /android/i.test(navigator.userAgent) ? 
					 "android" : 
					 /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? "ios" : "pc"
		}(),
		fui: function() {
			let i = this,
				reurl = i.opts.baseUrl + '/get_customer_info',
				params = {id: i.opts.log_id, sign: i.opts.sign, type: 1};

			$.ajax({type: 'POST', url: reurl, dataType: 'JSON', data: params,
				success: function(resp) {
					const { data } = resp;
					t.c_id = data.id;
					i.opts.info = data;
					t.custb = data;
					t.customer_service_id = data.customer_service_id;
					if (data && data.wechat_number) {
						let o = document.querySelectorAll(".wechat_number");
						for (let n = 0; n < o.length; n++) o[n].innerText = data.wechat_number;
					}
					if (data && data.qr_code_url) {
						let o = document.querySelectorAll(".wechat_qrcode");
						for (let n = 0; n < o.length; n++) o[n].src = data.qr_code_url;
					}
					// i.straght(data);
					if (data && data.b_page_type == 1) {
						if ([2, 4].includes(data.b_landing_page_type)) {
							$("#app").append(`<div class="complaint_box" style="display:none;"><div class="complaint_content">
								<a href="https://oss.jfb.qidianbox.com/tousu.html?logs_id=${i.opts.log_id}&hid=${data.page_id}&item_id=${data.id}&baseurl=${encodeURIComponent(i.opts.baseUrl)}&openid=${i.opts.openid}">
								<span class="icon"></span> <span>投</span><span>诉</span></a>
							</div></div>`);
							
							i.scroll();
						}
					}
				}
			})
		},
		straght: function (item) {
			let i = this,
				clickid = i.pqs('clickid') || i.pqs('qa_gdt') || i.pqs('click_id') || i.pqs('gdt_vid') || i.pqs('bd_vid');
			let jumpurl = i.opts.baseUrl+`/straight?sign=${i.opts.sign}&click_id=${clickid}&customer_service_id=${item.customer_service_id}&log_id=${i.opts.log_id}&type=4`;
			$.ajax({type: 'GET',url: jumpurl, dataType: 'json',
				success: function(resp) {
					window.wxMiniUrl = 'weixin://';
					if (resp.code == 200 && resp.data.openlink) {
						window.wxMiniUrl = resp.data.openlink || 'weixin://';
					}
				},
				fail: function(err) { 
					window.wxMiniUrl = null;
				},
			})
		},
		/* 判断是否在微信浏览器中打开 */
		iswx: function () {
			// 不是在微信内打开的页面 返回true 显示 否则不显示
			let lc = navigator.userAgent.toLowerCase();
			let wx = lc.indexOf('micromessenger') !== -1;
			let wxwork = lc.indexOf('wxwork') == -1;
			let wx_version = lc.match(/micromessenger\/(\d+\.\d+\.\d+)/) || lc.match(/micromessenger\/(\d+\.\d+)/);
			let version = wx_version ? wx_version[1] : '8.0.7';
			let ios_ver = '8.0.6';
			let android_ver = '8.0.3';
			if (wxwork) {
				if (wx && this.u == 'android' && this.cvr(version, android_ver) == 'lt') {
					return true;
				} else if (wx && this.u == 'ios' && this.cvr(version, ios_ver) == 'lt') {
					return true;
				}
			}
			return false;
		},
		/* 比较微信版本 */
		cvr: function (v1, v2) {
		  v1 = v1.split('.')
		  v2 = v2.split('.')
		  var len = Math.max(v1.length, v2.length)
		 
		  while (v1.length < len) {
		    v1.push('0')
		  }
		  while (v2.length < len) {
		    v2.push('0')
		  }
		 
		  for (var i = 0; i < len; i++) {
		    var num1 = parseInt(v1[i])
		    var num2 = parseInt(v2[i])
		 
		    if (num1 > num2) {
		        return 'gt'
		      } else if (num1 < num2) {
		        return 'lt'
		      }
		    }
		    return 'eq'
		},
		scroll: function () {
			let i = this;
			let isMobile = navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i);
			let docu = isMobile ? document : $("#mobileView");
			$(docu).on('scroll', i.throttle(function () {
				let innerHeight = window.innerHeight;
				let sTop = $(this).scrollTop();
				let oHeight = isMobile ? (document.documentElement.offsetHeight || document.body.offsetHeight) : document.querySelector("#mobileView").scrollHeight;
				// console.log(innerHeight, sTop, oHeight)
				if (sTop > oHeight / 3 || innerHeight >= oHeight) $('.complaint_box').removeAttr('style');
			}))
		},
		throttle: function(func, delay = 1000 / 60) {
			var prev = Date.now();
			return function() {
				var context = this;   //this指向window
				var args = arguments;
				var now = Date.now();
				if (now - prev >= delay) {
					func.apply(context, args);
					prev = Date.now();
				}
			}
		},
		
	}, t.fn.Hrrweb = function(n) {
		return this.each(function() {
			new i(t(this), n)
		})
	}
}(jQuery);
