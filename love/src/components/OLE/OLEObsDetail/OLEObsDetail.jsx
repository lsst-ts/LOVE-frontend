import React, { Component } from 'react';
import styles from './OLEObsDetail.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import { schemeOranges } from 'd3-scale-chromatic';

class OLEObsDetail extends Component {
  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    return (
      <div>
        <div className={styles.oleObsDetailReturn}>
          <span>Return to observations</span>
        </div>
        <div className={styles.oleObsDetaildiv}>
          <div className={styles.oleObsDetailTopContainer}>
            <div>
              <span className={styles.oleObsDetailObID}>Observation ID</span>
            </div>
            <div>
              <span className={styles.oleObsDetailObSt}>Obs. status</span>
            </div>
          </div>
          <div className={styles.oleObsDetailh3}>
            <h3>Messages(1)</h3>
          </div>
          <div className={styles.oleObsDetailContainer}>
            <div className={styles.oleObsDetailContainerItems}>
              <span>Flag</span>
              <Select></Select>
            </div>

            <div className={styles.oleObsDetailContainerItems}>
              <span>User</span>
              <Select></Select>
            </div>

            <div className={styles.oleObsDetailContainerItems}>
              <span>Date & Time</span>
              <Select></Select>
            </div>

            <div className={styles.oleObsDetailContainerItems}>
              <span>Msg ID</span>
              <Select></Select>
            </div>

            <div className={styles.oleObsDetailTextAreaFilter}>
              <Input></Input>
            </div>

            <div className={styles.oleObsDetailInputButtons}>
              <div className={styles.oleObsDetailCheckAll}>
                <Input type="checkbox"></Input>
                <span>All messages</span>
              </div>

              <div className={styles.oleObsDetailButtons}>
                <Button className={styles.oleObsDetailButDraw}>Withdraw message</Button>
                <Button>+ New Message</Button>
              </div>
            </div>

            <div className={styles.oleObsDetailMssgs}>
              {/* here goes maybe a map function */}
              <div className={styles.oleObsDetailInputCheck}>
                <Input type="checkbox"></Input>
              </div>
              <div className={styles.oleObsDetailBoxDiv}>
                <span className={styles.oleObsDetailSpan1}>
                  On <strong>date</strong> at <strong>time</strong>, <strong>person-name</strong> wrote:
                </span>
                <box>
                  <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi imperdiet molestie lectus non
                    commodo. Curabitur libero tellus, tincidunt eu lacus quis, eleifend malesuada nisl. Cras dignissim
                    cursus leo at pretium. Maecenas nisi neque, iaculis id placerat vel, dictum eu libero. Pellentesque
                    pharetra eros eu dolor pulvinar fringilla. Nunc vel faucibus turpis. Mauris at dui feugiat, iaculis
                    lectus nec, bibendum odio. Pellentesque imperdiet et ipsum sit amet interdum.
                  </span>
                </box>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OLEObsDetail;
