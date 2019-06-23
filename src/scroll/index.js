import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';
import BScroll from 'better-scroll';
import Loading from '../loading/loading';
import './betterScroll.css';
import 'antd-mobile/dist/antd-mobile.css';

const defaultPullDownRefresh = {
  threshold: 100,
  stop: 50,
  stopTime: 600,
  txt: {
    success: '刷新成功',
  },
};

const defaultPullUpLoad = {
  threshold: 0,
  txt: {
    more: '加载更多',
    nomore: '我是有底线的',
  },
};

class Scroll extends Component {
  static defaultProps = {
    probeType: 3,
    click: false, // https://ustbhuangyi.github.io/better-scroll/doc/options.html#tap
    startY: 0,
    scrollY: true,
    scrollX: false,
    freeScroll: true,
    scrollbar: true,
    pullDownRefresh: false,
    pullUpLoad: false,
    bounce: true,
    preventDefaultException: {
      className: /(^|\s)originEvent(\s|$)/,
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|TABLE)$/,
    },
    eventPassthrough: '',
    // 这个参数意义不大
    isPullUpTipHide: true,
    disabled: false,
    stopPropagation: true,
  }

  static propTypes = {
    children: PropTypes.any,
    probeType: PropTypes.number,
    startY: PropTypes.number,
    click: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    scrollY: PropTypes.bool,
    scrollX: PropTypes.bool,
    freeScroll: PropTypes.bool,
    scrollbar: PropTypes.bool,
    pullDownRefresh: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    pullUpLoad: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    pullUpLoadMoreData: PropTypes.func,
    // canRenderPullUpTip: PropTypes.bool,
    doPullDownFresh: PropTypes.func,
    doScroll: PropTypes.func,
    doScrollStart: PropTypes.func,
    doScrollEnd: PropTypes.func,

    preventDefaultException: PropTypes.object,
    eventPassthrough: PropTypes.string,
    isPullUpTipHide: PropTypes.bool,
    bounce: PropTypes.bool,
    disabled: PropTypes.bool,
    stopPropagation: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context);
    // scroll 实例
    this.scroll = null;
    this.isRebounding = false;
    this.pulling = false;
    this.pullDownInitTop = -50;

    this.state = {
      isPullUpLoad: false,
      beforePullDown: true,
      pulling: false,
      pullDownStyle: {
        top: `${this.pullDownInitTop}px`,
      },
      // bubbleY: 0,
    };
  }

  componentDidMount() {
    this.initScroll();
  }

  componentDidUpdate(prevProps) {
    const { children, disabled } = this.props;
    const { pulling } = this.state;
    if (children !== prevProps.children) {
      if (!pulling) {
        this.scroll.refresh();
      }
      if (prevProps.disabled !== disabled) {
        if (disabled) {
          this.scroll.disable();
        } else {
          this.scroll.enable();
        }
      }
    }
  }

  componentWillUnmount() {
    this.scroll.stop();
    this.scroll.destroy();
    this.scroll = null;
    clearTimeout(this.TimerA);
    clearTimeout(this.TimerB);
  }

  createScrollId=() => Math.random().toString(36).substr(3, 10)


  getScrollObj = () => this.scroll


  initEvents() {
    const {
      doScrollStart, doScroll, doScrollEnd, disabled,
    } = this.props;
    if (this.options.pullUpLoad) {
      this._initPullUpLoad();
    }
    if (this.options.pullDownRefresh) {
      this._initPullDownRefresh();
    }
    if (doScrollStart) {
      this.scroll.on('scrollStart', (pos) => {
        doScrollStart(pos);
      });
    }
    if (doScroll) {
      this.scroll.on('scroll', (pos) => {
        doScroll(pos);
      });
    }
    if (doScrollEnd) {
      this.scroll.on('scrollEnd', (pos) => {
        doScrollEnd(pos);
      });
    }
    if (disabled) {
      this.scroll.disable();
    }
  }

  initScroll() {
    const {
      probeType,
      click,
      startY,
      scrollY,
      scrollX,
      freeScroll,
      scrollbar,
      pullDownRefresh,
      pullUpLoad,
      preventDefaultException,
      eventPassthrough,
      bounce,
      stopPropagation,
    } = this.props;
    // eslint不允许嵌套的三元表达式
    let cpullDownRefresh = {};
    if (typeof pullDownRefresh === 'object') {
      cpullDownRefresh = {
        ...defaultPullDownRefresh,
        ...pullDownRefresh,
      };
    } else if (pullDownRefresh) {
      cpullDownRefresh = defaultPullDownRefresh;
    } else {
      cpullDownRefresh = false;
    }
    let cpullUpLoad = {};
    if (typeof pullUpLoad === 'object') {
      cpullUpLoad = {
        ...defaultPullUpLoad,
        ...pullUpLoad,
      };
    } else if (pullUpLoad) {
      cpullUpLoad = defaultPullUpLoad;
    } else {
      cpullUpLoad = false;
    }
    this.options = {
      probeType,
      click,
      startY,
      scrollY,
      freeScroll,
      scrollX,
      scrollbar,
      pullDownRefresh: cpullDownRefresh,
      pullUpLoad: cpullUpLoad,
      preventDefaultException,
      eventPassthrough,
      bounce,
      stopPropagation,
    };
    const wrapper = this.wrap;
    this.scroll = new BScroll(wrapper, this.options);
    this.initEvents();
  }

  _reboundPullDown = () => {
    const { stopTime = 600 } = this.options.pullDownRefresh;

    return new Promise((resolve) => {
      this.TimerA = setTimeout(() => {
        this.isRebounding = true;
        this.scroll.finishPullDown();
        resolve();
      }, stopTime);
    });
  }

  _afterPullDown() {
    this.TimerB = setTimeout(() => {
      this.setState({
        beforePullDown: true,
        pullDownStyle: {
          top: `${this.pullDownInitTop}px`,
        },
      });
      this.isRebounding = false;
      this.scroll.refresh();
    }, this.scroll.options.bounceTime);
  }

  _initPullUpLoad = () => {
    const { pullUpLoadMoreData } = this.props;
    this.scroll.on('pullingUp', () => {
      this.setState({
        isPullUpLoad: true,
      });

      pullUpLoadMoreData().then(() => {
        if (!this.scroll) { return; }
        this.setState({
          isPullUpLoad: false,
        });
        this.scroll.finishPullUp();
        this.scroll.refresh();
      });
    });
  }

  _initPullDownRefresh() {
    const { doPullDownFresh } = this.props;
    this.scroll.on('pullingDown', () => {
      this.setState({
        beforePullDown: false,
        pulling: true,
      });

      doPullDownFresh()
        .then(() => {
          if (!this.scroll) { return; }
          this.setState({
            pulling: false,
          });
          this._reboundPullDown()
            .then(() => {
              this._afterPullDown();
            });
        });
    });

    this.scroll.on('scroll', (pos) => {
      const { beforePullDown } = this.state;

      if (pos.y < 0) {
        return;
      }

      if (beforePullDown) {
        this.setState({
          // bubbleY: Math.max(0, pos.y + this.pullDownInitTop),
          pullDownStyle: {
            top: `${Math.min(pos.y + this.pullDownInitTop, 10)}px`,
          },
        });
      } else {
        // this.setState({
        //   bubbleY: 0,
        // });
      }

      if (this.isRebounding) {
        this.setState({
          pullDownStyle: {
            top: `${10 - (defaultPullDownRefresh.stop - pos.y)}px`,
          },
        });
      }
    });
  }

  renderPullUpLoad() {
    const { pullUpLoad, isPullUpTipHide } = this.props;
    const { isPullUpLoad } = this.state;
    if (pullUpLoad && isPullUpTipHide) {
      return (
        <div className="b-pullup-wrapper">
          <div className="after-trigger" style={{ lineHeight: '.32rem' }}>
            <span style={{ color: '#999999', fontSize: '.28rem' }} />
          </div>
        </div>
      );
    }

    if (pullUpLoad && isPullUpLoad) {
      return (
        <div className="b-pullup-wrapper">
          <div className="after-trigger" style={{ lineHeight: '.32rem' }}>
            <i className="loading-icon" />
            {/*
             <div style={{ color: '#999999', fontSize: '.28rem' }}>
              {typeof pullUpLoad === 'object' ? pullUpLoad.txt.more : '加载中...'}
             </div>
             */}
            <br />
            <Icon type="loading" />
          </div>
        </div>
      );
    }
    if (pullUpLoad && !isPullUpLoad) {
      return (
        <div className="b-pullup-wrapper">
          <div className="before-trigger">
            <span style={{ color: '#999999', fontSize: '.28rem' }}>{typeof pullUpLoad === 'object' ? pullUpLoad.txt.nomore : '加载完成'}</span>
          </div>
        </div>
      );
    }
  }

  renderPullUpDown() {
    const { pullDownRefresh } = this.props;
    const { beforePullDown, pulling, pullDownStyle } = this.state;

    if (pullDownRefresh && beforePullDown) {
      return (
        <div className="b-pulldown-wrapper" style={pullDownStyle}>
          <div className="before-trigger" />
        </div>

      );
    }

    if (pullDownRefresh && !beforePullDown && pulling) {
      return (
        <div className="b-pulldown-wrapper" style={pullDownStyle}>
          <div className="after-trigger">
            <div className="loading">
              <Loading />
            </div>
          </div>
        </div>
      );
    }

    if (pullDownRefresh && !beforePullDown && !pulling) {
      return (
        <div className="b-pulldown-wrapper" style={pullDownStyle}>
          <div className="after-trigger">
            <div>
              <span
                style={{ fontSize: '.18rem' }}
              >
                {typeof this.options.pullDownRefresh === 'object' ? this.options.pullDownRefresh.txt.success : '刷新完成'}
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div className="b-wrapper" ref={(wrap) => { this.wrap = wrap; }}>
        <div className="b-scroll-content">
          {children}
          {this.renderPullUpLoad()}
        </div>
        {this.renderPullUpDown()}
      </div>
    );
  }
}

export default Scroll;
