import React, { Component } from 'react';
import Scroll from 'src/scroll';

import './main.css';

const Data = [];
let NEWDATAINDEX = 1;
for (let i = 0; i < 10; i++) {
  Data.push(i);
}
class PullupScrollPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      listData: Data,
      // childData: 666,
    };
  }

  componentWillMount() {
    NEWDATAINDEX = 1;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    console.log('compomentWillUnmount');
    console.log(this.timer);
    clearTimeout(this.timer);
  }

  loadMoreData = () => new Promise((resolve) => {
    console.log('pulling up and load data');
    const { listData } = this.state;
    this.timer = setTimeout(() => {
      if (Math.random() > 0) {
        // 如果有新数据
        const newPage = [];
        for (let i = 0; i < 2; i++) {
          newPage.push(`我是新数据${NEWDATAINDEX++}`);
        }
        this.setState({
          listData: [
            ...listData,
            ...newPage,
          ],
        });
      }
      resolve();
    }, 1000);
  })


  clickItem=(item) => {
    console.log('clickEvent', item);
  }

  render() {
    const { listData } = this.state;
    return (
      <div>
        <div className="container">
          <Scroll
            pullUpLoad
            pullUpLoadMoreData={this.loadMoreData}
            // 不拖动不显示
            isPullUpTipHide={false}
          >
            <ul className="content">
              {listData.map(item => (
                <li
                  className="content-item"
                  key={item}
                  onClick={this.clickItem.bind(this, item)}
                >
                  item:
                  {item}
                </li>
              ))}
            </ul>
          </Scroll>
        </div>
      </div>
    );
  }
}

export default PullupScrollPage;
