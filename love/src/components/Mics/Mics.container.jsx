import React from 'react';
import Mics from './Mics';

export const schema = {
  description: 'Component that displays the microphones',
  defaultSize: [75, 38],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Microphones Component',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    mics: {
      type: 'array',
      description: 'List of the microphones. ',
      isPrivate: false,
      default: [
        {
          id: 1,
          name: 'Radio Bio-bio',
          location: 'Main Telescope',
          src: 'https://redirector.dps.live/biobiosantiago/mp3/icecast.audio',
          dbLimit: 40,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 2,
          name: 'Radio Carolina',
          location: 'Main Telescope',
          src: 'https://jireh-1-hls-audio-us-isp.dps.live/hls-audio/716888c72e2079612211a7130f67a27d/carolina/playlist/manifest/gotardisz/audio/now/livestream1.m3u8?dpssid=b2191543965963287cd50987a&sid=ba5t1l1xb287782483663287cd509878',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 3,
          name: 'Radio Futuro',
          location: 'Auxiliary Telescope',
          src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/FUTUROAAC_SC',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 5,
          name: 'Radio ADN',
          location: 'Summit Facility',
          src: 'https://24383.live.streamtheworld.com/ADN_SC?DIST=TuneIn&TGT=TuneIn&maxServers=2&gdpr=0&us_privacy=1YNY&partnertok=eyJhbGciOiJIUzI1NiIsImtpZCI6InR1bmVpbiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVkX3BhcnRuZXIiOnRydWUsImlhdCI6MTYzMzM5MjExNiwiaXNzIjoidGlzcnYifQ.apBDljw5PC4GQwEls0GoHYCMKg91TAZrYLziiqLdh1U',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 6,
          name: '1KHz',
          location: 'Summit Facility',
          src: 'http://localhost/1khz.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 7,
          name: '400Hz',
          location: 'Summit Facility',
          src: 'http://localhost/400hz.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 8,
          name: 'Sounds 432hz',
          location: 'Summit Facility',
          src: 'http://localhost/sounds_432hz.mp3',
          minDecibels: -120,
          dbLimit: 20,
          maxDecibels: 0,
        },
        {
          id: 9,
          name: 'Sounds',
          location: 'Summit Facility',
          src: 'http://localhost/sounds.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 10,
          name: 'Abandoned Warehouse',
          location: 'Auxiliary Telescope',
          src: 'http://localhost/abandoned-warehouse-6685.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id:11,
          name: 'Piano Suspenses',
          location: 'Auxiliary Telescope',
          src: 'http://localhost/piano-suspenses-14427.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
      ]
    }
  },
};

const MicsContainer = (props) => {
  const mics = props.mics || schema.props.mics.default;
  return (
    <Mics 
      mics={mics}
    />
  );
};

export default MicsContainer;