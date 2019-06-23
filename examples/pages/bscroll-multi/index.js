import React, { Component } from 'react';
import Scroll from 'src/scroll';
import './main.css';

const Data = [];
for (let i = 0; i < 10; i++) {
  Data.push(i);
}
const Data2 = [];
for (let i = 10; i < 20; i++) {
  Data2.push(i);
}
class BscrollMultiPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      listData: Data,
      listData2: Data2,
    };
  }

  componentDidMount() {
    for (let i = 10; i < 30; i++) {
      Data.push(i);
    }
  }

  clickItem=(item) => {
    console.log('clickEvent', item);
  }

  render() {
    const { listData } = this.state;
    return (
      <div>
        <div className="container">
          <Scroll>
            <ul className="content">
              {listData.map(item => (
                <li
                  className="content-item"
                  key={item}
                  onKeyUp={this.clickItem.bind(this, item)}
                >
                  item:
                  {item}
                </li>
              ))}
            </ul>
          </Scroll>
        </div>
        <div className="container">
          <Scroll>
            <ul className="content">
              {this.state.listData2.map((item, index) => (
                <li
                  className="content-item"
                  key={index}
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

export default BscrollMultiPage;
