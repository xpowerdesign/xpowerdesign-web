import {formatMessage} from 'umi-plugin-react/locale';

const NODE_COLORS = {
  TRIGGER: {
    fill: '#48C9B0',
    border: '#1ABC9C',
  },
  LOGIC: {
    fill: '#AF7AC5',
    border: '#9B59B6',
  },
  DATA: {
    fill: '#5DADE2',
    border: '#3498DB',
  },
  ACTION: {
    fill: '#F5B041',
    border: 'rgb(243, 156, 18)',
  },
};

const OUT_PORT_TYPE = {
  SINGLE: 'SINGLE',
  STATIC: 'STATIC',
  DYNAMIC: 'DYNAMIC',
  BROADCAST: 'BROADCAST',
};

const DESCRIPTIONS = {
  script: formatMessage({id: 'editor.common.name'}),
  template: formatMessage({id: 'editor.common.name'}),
  json: formatMessage({id: 'editor.common.name'}),
  cron: formatMessage({id: 'editor.common.name'}),
};

export {
  NODE_COLORS,
  OUT_PORT_TYPE,
  DESCRIPTIONS,
};
