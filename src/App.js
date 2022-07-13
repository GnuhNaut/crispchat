/* eslint-disable no-useless-constructor */
import React from 'react';
import Api from './axios';
import 'antd/dist/antd.css';
import {
  Table,
  Tabs,
  DatePicker,
  Modal
} from 'antd'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const website = 'edb1ff43-f5e8-4543-a941-5a1ab7950458'
class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  componentDidMount = () => {
    Api.get('/count-ticket')
      .then(res => {
        console.log('res', res.data[0])
        this.setState({
          dataSource: res.data[0]
        })
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
    Api.get('/first-time-response')
      .then(res => {
        console.log('res', res.data)
        this.setState({
          dataFirstResponse: res.data.first_response,
          dataResponse: res.data.response
        })
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
    Api.get('/resolved-Conversation')
      .then(res => {
        console.log('res', res.data)
        this.setState({
          dataClose: res.data.closeData
        })
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
  }
  
  render(){
    const columns = [
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: 'Assigned',
        key: 'total',
        dataIndex: 'total',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: 'Open',
        key: 'open',
        dataIndex: 'open',
        render: (record, data) => (
          <div
              style={{
                  paddingLeft: this.state.isMobile ? 20 : 0
              }}
              onClick={e => {
                if(data.open === 0 || data.name === "All"){
                  return 0;
                }
                this.setState({
                  modalCountOpen: true,
                  openData: data.ticket_unresolve,
                  nameModal: data.name
                })
                console.log('datatable', data.ticket_unresolve)
              }}
          >
                  {record}
          </div>
      )
      },
    ]
    const columns1 = [
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
        defaultSortOrder: 'descend',
      },
      {
        title: 'Total time',
        key: 'time',
        dataIndex: 'time',
        render: record => {
          return (
            <div>
              {record}
            </div>
          )
        }
      },
      {
        title: 'Total Conversation',
        key: 'count',
        dataIndex: 'count',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.count - b.count,
      },
      {
        title: 'Avg Time',
        key: 'avg',
        dataIndex: 'avg',
        render: record => {
          return (
            <div>
              {record}
            </div>
          )
        }
      },
    ]
    return (
      <div style={{
        padding: "20px 50px"
      }}>
        {/* <RangePicker showTime onChange={(x, y)=>{
          console.log('x', x)
          console.log('y', y)
        }}/> */}
        <RangePicker showTime onChange={(date, dateString) => {
          console.log('date', date)
          // console.log('dateString', Date.parse(dateString))
          const params = {
            start : dateString[0],
            end: dateString[1] 
        }
        let config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' : 'Content-Type, X-Auth-Token, Origin',
            }
        }
          Api.get('/count-ticket?start='+Date.parse(dateString[0]) / 1000+'&end='+Date.parse(dateString[1]) / 1000, config)
          .then(res => {
            console.log('res', res.data[0])
            this.setState({
              dataSource: res.data[0]
            })
          })
          .catch(error => {
              console.error('There was an error!', error);
          });
          Api.get('/first-time-response?start='+Date.parse(dateString[0]) / 1000+'&end='+Date.parse(dateString[1]) / 1000, config)
            .then(res => {
              console.log('res', res.data)
              this.setState({
                dataFirstResponse: res.data.first_response,
                dataResponse: res.data.response
              })
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
          Api.get('/resolved-Conversation?start='+Date.parse(dateString[0]) / 1000+'&end='+Date.parse(dateString[1]) / 1000, config)
            .then(res => {
              console.log('res', res.data)
              this.setState({
                dataClose: res.data.closeData,
              })
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }} />
        <div style={{
          height: 20
        }}>

        </div>
        <Tabs defaultActiveKey="1" onChange={e => {
          this.setState({
            keyTab: e
          })
        }}>
            <TabPane tab="Count" key={1}>
              <Table columns={columns} dataSource={this.state.dataSource}/>
            </TabPane>
            <TabPane tab="Resolved Conversations" key={4}>
              <Table columns={columns1} dataSource={this.state.dataClose}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: event => {
                      console.log('record', record)
                      if(record.name === 'All'){
                        return true;
                      }
                      this.setState({
                        nameModal: record.name,
                        dataCloseModal: record.session,
                        modalClose: true
                      })
                    }, 
                  };
                }}
              />
            </TabPane>
            <TabPane tab="Avg First Response" key={2}>
              <Table columns={columns1} dataSource={this.state.dataFirstResponse}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: event => {
                      console.log('record', record)
                      if(record.name === 'All'){
                        return true;
                      }
                      this.setState({
                        nameModal: record.name,
                        firstData: record.session,
                        modalFirstResponse: true
                      })
                    }, 
                  };
                }}
              />
            </TabPane>
            <TabPane tab="Avg Response" key={3}>
              <Table columns={columns1} dataSource={this.state.dataResponse}/>
            </TabPane>
          </Tabs>
          <Modal title={"Conversation Unresolved " + this.state.nameModal} footer={null} visible={this.state.modalCountOpen} onCancel={e=>this.setState({modalCountOpen: false})}>
            {
              this.state.openData && this.state.openData.map((e, i) => {
                console.log('data', e)
                return (
                  <div
                    style={{
                      padding: '5px 10px',
                      borderBottom: '1px solid #0000004d'
                    }}
                  >
                    <a href={`https://app.crisp.chat/website/${website}/inbox/${e.session_id}`} target="_blank">{e.nickname}</a>
                  </div>
                )
              })
            }
          </Modal>
          <Modal title={"Conversation Resolved " + this.state.nameModal} footer={null} visible={this.state.modalCountClose} onCancel={e=>this.setState({modalCountClose: false})}>
            {
              this.state.closeData && this.state.closeData.map((e, i) => {
                console.log('data', e)
                return (
                  <div
                    style={{
                      padding: '5px 10px',
                      borderBottom: '1px solid #0000004d'
                    }}
                  >
                    <a href={`https://app.crisp.chat/website/${website}/inbox/${e.session_id}`} target="_blank">{e.nickname}</a>
                  </div>
                )
              })
            }
          </Modal>
          <Modal title={"Conversation First Response " + this.state.nameModal} footer={null} visible={this.state.modalFirstResponse} onCancel={e=>this.setState({modalFirstResponse: false})}>
            {
              this.state.firstData && this.state.firstData.map((e, i) => {
                console.log('data', e)
                return (
                  <div
                    style={{
                      padding: '5px 10px',
                      borderBottom: '1px solid #0000004d'
                    }}
                  >
                    <a href={`https://app.crisp.chat/website/${website}/inbox/${e.id}`} target="_blank">
                      <span
                        style={{
                          paddingRight: 50
                        }}
                      >
                        {e.nickname}
                      </span>
                      <span>
                          {e.time}
                      </span>
                    </a>
                  </div>
                )
              })
            }
          </Modal>
          <Modal title={"Resolved Conversations " + this.state.nameModal} footer={null} visible={this.state.modalClose} onCancel={e=>this.setState({modalClose: false})}>
            {
              this.state.dataCloseModal && this.state.dataCloseModal.map((e, i) => {
                console.log('data', e)
                return (
                  <div
                    style={{
                      padding: '5px 10px',
                      borderBottom: '1px solid #0000004d'
                    }}
                  >
                    <a href={`https://app.crisp.chat/website/${website}/inbox/${e.id}`} target="_blank">
                      <span
                        style={{
                          paddingRight: 50
                        }}
                      >
                        {e.nickname}
                      </span>
                      <span>
                          {e.time}
                      </span>
                    </a>
                  </div>
                )
              })
            }
          </Modal>
      </div>
    )
  }

}

export default App;
