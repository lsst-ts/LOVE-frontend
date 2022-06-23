import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import Message from './Message/Message';
import MessageEdit from './Message/MessageEdit';
import ManagerInterface from 'Utils';
import styles from './Exposure.module.css';


export default class ExposureDetail extends Component {
  static propTypes = {
    back: PropTypes.func,
    logDetail: PropTypes.object,
    logMessages:  PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    back: () => {},
    logDetail: {
      obs_id: 'LC20210224-1',
      instrument: 'LATISS',
      observation_type: 'Engtest',
      observation_reason: 'extra',
      observation_day: undefined,
    },
    logMessages: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        site_id: '',
        type: undefined,
        user: undefined,
        exposure_flag: undefined,
        jira: undefined,
        file: undefined,
        message_text: undefined,
        date_added: undefined,
        date_invalidated: undefined,
      },
    ]
  };

  saveMessage(message) {
    console.log('save message', message);
    ManagerInterface.updateMessageExposureLogs(message.id, message).then((response) => {
      console.log('result', response);
    });
  }

  deleteMessage(message) {
    console.log('deleteMessage', message);
    ManagerInterface.deleteMessageExposureLogs(message.id).then((response) => {
      console.log('result', response);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedMessage: undefined,
    };
  }

  render() {
    const link = this.props.back;
    const logDetail = this.props.logDetail ? this.props.logDetail : this.defaultProps.logDetail;
    const logMessages = this.props.logMessages ? this.props.logMessages : this.defaultProps.logMessages;

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button status="link" onClick={() => { link() }}>
            <span className={styles.title}>{`< Return to Observations`}</span>
          </Button>
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <span>{logDetail.obs_id}</span>
            <span><Button status="link">view Jira ticket</Button></span>
            <span className={styles.floatRight}>
              [{logDetail.observation_type}]
            </span>
          </div>
          <div className={styles.body}>
            <div className={[styles.floatLeft, styles.title].join(' ')}>
              Messages ({logMessages ? logMessages.length : 0})
            </div>
            <div className={styles.filters}> FILTERS </div>
          
          { logMessages.map((message) => {
              if (this.state.selectedMessage && this.state.selectedMessage.id === message.id) {
                return (<MessageEdit
                    message={this.state.selectedMessage}
                    cancel={() => { this.setState({ selectedMessage: undefined}); }}
                    save={(message) => { this.saveMessage(message); this.setState({ selectedMessage: undefined}); }}
                  />);
              } else {
                return (<Message
                          message={message}
                          editMessage={(messageEdit) => { this.setState({ selectedMessage: messageEdit}); }}
                          deleteMessage={(mesage) => { this.deleteMessage(message); }}
                        />);
              }
              
            })
          }
          </div>
        </div>
      </>
    );
  }
}