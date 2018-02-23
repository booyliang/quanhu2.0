/**
*	Author: aiqingmin
*
*/
<template>
  <div class="">
    <div class="nav" v-if="showNav" v-text="title"></div>
    <y-forward-bar v-if="transferData" :data="transferData"></y-forward-bar>
    <a :href="downloadUrl" class="down-btn" v-if="showDownload">
    	<img src="/assets/static/quanhu_download@2x.png" />
    </a>
  </div>
</template>
<script type="text/javascript">
	export default {
		name: 'y-control-forward',
		data() {
			return {
				title: '',
				coverNav: false,
				transferData: null,
				showNav: false,
				showDownload: false,
			};
		},
		props: {},
		methods: {
			fillForwardHtml() {
				let parentDiv = document.getElementById('forward-body-wrap');

				var _bodyHtml = "";
				parentDiv.innerHTML = '';
				let targets = document.getElementsByClassName('flow_detail');

				if (targets && targets.length > 0) {
					let target =  targets[0];
					let html = [];
					let endHtml = [];
					let parentElement = target.parentElement;
					while (parentElement && parentElement.id !== 'app') {
						html.unshift('<div class=' + parentElement.className + '>');
						parentElement = parentElement.parentElement;
						endHtml.push('</div>')
					}
					for (let i = 0; i < targets.length; i++) {
						html.push(targets[i].outerHTML);
					}
					_bodyHtml = html.join('') + endHtml.join('')

				}
				parentDiv.innerHTML = _bodyHtml;
				let linkList = document.querySelectorAll('#forward-body-wrap a');
				for (let link of linkList) {
					link.removeAttribute('href');
				}

			},
			observerBody() {
				let targets = document.getElementsByClassName('flow_detail');
				if (targets && targets.length > 0) {
					// 传入目标节点和观察选项
					let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
					let target = targets[0];
					let observer = new MutationObserver(this.fillForwardHtml);
					let config = { attributes: true, childList: true, characterData: true, subtree: true };
					observer.observe(target, config); // DOM 加载完后触发callback fillForwardHtml
					// 本地未监听到DOM变化时
					this.fillForwardHtml();
					return;
				}
				// flow-body 未加载
				setTimeout(function () {
					this.observerBody();
				}.bind(this), 10)
			}
		},
		mounted() {
			if (this.$route.meta.disableForward)
				return;
			if (this.$route.query.type === 'forward') {
				document.getElementById('app').className = 'yryz-forward';
				var parentDiv = document.createElement('div');
				parentDiv.id = "forward-body-wrap";
				document.body.appendChild(parentDiv);
				this.observerBody();
			} else if (this.$route.query.type === 'transfer' && this.$route.query.custId) {
				// 打赏之后的转发
				document.getElementById('app').className = 'transfer';
				this.showDownload = !this.$yryz.isNative();
				// this.showDownload =true;
				let entityId = parseInt(this.$route.query.transferId);
				let custId = this.$route.query.custId;

				this.$openApi.post('/api/v3/transfer/getTransferDetail', {id: entityId,	custId})
				.then(res => {
					this.transferData = res.data.data;
				});
			}
			else if (this.$utils.NODE_ENV !== "development" && !this.$yryz.isNative()) {
				this.showDownload = true;
				this.showNav = true;
				document.getElementById('app').className = 'hideBtn yryz-download';
				let title = this.$circle.moduleName
				if (!title) {
					if (document.getElementsByClassName('nav-center')[0]) {
						title =  document.getElementsByClassName('nav-center')[0].children[0].innerText;
					} else {
						title = '圈子有了，一切都有了！';
					}
				}
				this.title = '圈乎-' + title;
			}
		},
		computed: {
			downloadUrl() {
				var ua = window.navigator.userAgent.toLowerCase();
				var env = this.$env;
				var isSafari = (ua.indexOf('chrome') < 0) || env.devType === '1';
				return isSafari ? 'https://static.yryz.com/quanhu/download/index.html' : 'https://static.yryz.com/quanhu/download/index.html';
			}
		},

	};
</script>
<style type="text/css">
#forward-body-wrap {
  /*padding: 0.4rem 0.3rem;*/
  /*background: #fff;*/
  & .flow-foot {
    display: none;
  }
  & .flow-head {
    & .avatar {
      display: none;
    }
  }
  & button {
    display: none;
  }
  & .cover.flow_detail{
	  padding: 0 0;
  }
}

.yryz-forward {
  display: none;
}

.yryz-download {
	padding-bottom: 1.2rem;
  & .nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    height: 1.28rem;
    width: 100%;
    text-align: center;
    background: #f9f9f9;
    color: #333;
    font-size: 0.36rem;
    border-bottom: 1px solid #e5e5e5;
  }
}

.transfer .flow-detail .flow-head .card .avatar {
  display: none;
}

.down-btn {
  display: block;
  position: fixed;
  font-size: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  background: #f8f8f8;
  padding: .2rem .3rem;
  box-shadow: 1px 0 10px #a7a7a7;
}

.hideBtn .heat {
  display: none;
}
</style>
