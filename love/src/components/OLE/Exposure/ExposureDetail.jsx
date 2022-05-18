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
import styles from './Exposure.module.css';


export default class ExposureDetail extends Component {
  static propTypes = {
    back: PropTypes.func,
    logDetail: PropTypes.object,
  };

  static defaultProps = {
    back: () => {},
    logDetail: {
      obsId: 'LC20210224-1',
      obsStatus: 'Ongoing',
      instrument: 'LATISS',
      obsType: 'Engtest',
      obsReason: 'extra',
      obsDay: undefined,
      messages: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          siteId: '',
          type: undefined,
          user: undefined,
          flag: undefined,
          jira: undefined,
          file: undefined,
          description: undefined,
          dateAdded: undefined,
          dateInvalidated: undefined,
        },
      ]
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedMessage: undefined,
    };
  }


  render() {
    const link = this.props.back;
    const logDetail = this.props.logDetail ? this.props.logDetail : this.defaultProps.logDetail;

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button status="link" onClick={() => { link() }}>
            <span className={styles.title}>{`< Return to Observations`}</span>
          </Button>
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <span>{logDetail.obsId} - {logDetail.obsType}</span>
            <span><Button status="link">view Jira ticket</Button></span>
            <span className={styles.floatRight}>
              [{logDetail.obsStatus}]
            </span>
          </div>
          <div className={styles.body}>
            <div className={[styles.floatLeft, styles.title].join(' ')}>
              Messages ({logDetail.messages ? logDetail.messages.length : 0})
            </div>
            <div className={styles.filters}> FILTERS </div>
          
          { logDetail.messages.map((message) => {
              if (this.state.selectedMessage && this.state.selectedMessage.id === message.id) {
                return (<MessageEdit
                    message={this.state.selectedMessage}
                    cancel={() => { this.setState({ selectedMessage: undefined}); }}
                    save={(message) => { console.log('save: ', message); }}
                  />);
              } else {
                return (<Message message={message} editMessage={(messageEdit) => { this.setState({ selectedMessage: messageEdit}); }}/>);
              }
              
            })
          }
          </div>
        </div>
      </>
    );
  }
}