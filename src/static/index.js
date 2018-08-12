(function($){
	$().ready(function(){
		$.get('http://fly.layui.com/user', function(res){
			var html = $(res);
			if(/<title>(.*)<\/title>/g.exec(res)[1] == '登入 - Fly社区'){
				createTab('http://fly.layui.com/user')
			}else{
				getInfo(res, html);
				getContent();
			}
		});
	});
	
	
	function getInfo(res, html){
		signed();
		var head = html.find('#LAY_header_avatar');
		var usr = head.find('cite').text();
		var img = 'https:' + head.find('img').attr('src');
		$('#LAY_header_avatar cite').text(usr);		
		$('#LAY_header_avatar img').attr('src', img);
		
		var url = /<a href="([a-z\/0-9]+)"> .* 我的主页 <\/a>/g.exec(res)[1];
		$.get('http://fly.layui.com' + url, function(res){
			var dom = $(res);
			var fwiwen = /[0-9]+/g.exec(dom.find('.fly-home-info span:first').text())[0]
			$('.header .feiwen').text(fwiwen);
		});
	}
	
	function signed(){
		//走接口获取签到天数
		//{"status":0,"data":{"days":3,"experience":5,"signed":false,"token":"c73f05b66f7dcb33a6eff0779e4f25bf4a8779e4"}}
		$.post('http://fly.layui.com/sign/status', function(res){
			$('.header .days').text(res.data.days);
			var token = res.data.token;
			if(res.data.signed){
				$('.header button').text('今日已签到');
				$('.header button').addClass('layui-btn-disabled');
			}else{
				$('.header button').text('今日未签到');
				$('.header button').one('click', function(){
					//http://fly.layui.com/sign/in
					//{"status":0,"data":{"days":4,"experience":5,"signed":true}}
					$.post('http://fly.layui.com/sign/in', {token: token}, function(signedRes){
						console.log("签到结果: " + signedRes);
					});
					signed();
					return false;
				});
			}
		});
	}
	
	function getContent(){
		$.get('http://fly.layui.com/', function(res){
			var html = $(res);
			
			var zdHtml = [];
			html.find('.fly-list:eq(0)').find('li').each(function(index, item){
				zdHtml.push(ex(item.outerHTML));
			});
			$(".zd .fly-list").html(zdHtml.join(''));
			
			var twHtml = [];
			html.find('.fly-list:eq(1)').find('li').each(function(index, item){
				if(index < 8){
					twHtml.push(ex(item.outerHTML));
				}
			});
			$(".zx .fly-list").html(twHtml.join(''));
		});
	}
	
	function ex(html){
//		<a href="/u/4966584" class="fly-avatar"> <img src="//res.layui.com/images/fly/avatar/8.jpg" alt="Stream"> </a>
//		<img src="//res.layui.com/images/fly/avatar/8.jpg" alt="Stream">
		html = html.replace(/<a href="\//g, '<a href="http://fly.layui.com/');
		html = html.replace(/<img src="\/\//g, '<img src="http://');
		return html;		
	}
	
	function createTab(url){
		chrome.tabs.create({
		    url: url,
		    active: true,
		}, function(tab){
		    console.log(tab);
		});
	}
	
	
	$(document).on('click', function(e){
		var that = $(e.target);
		if(!that.is('a')){
			that = that.parents('a');
		}
		var url = that.attr('href');
		if(!url || url.indexOf('javascript:;') != -1){
			return ;
		}
		createTab(url);
	});
	
})($);
