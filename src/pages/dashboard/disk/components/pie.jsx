import { Chart, Coordinate, Tooltip, Axis, Interval, Annotation, Legend } from 'bizcharts';

const PieCharts = (props) => {
  const cols = {
    percent: {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    },
  };
  console.log("Legend ==>", )
  return (
    <div>
      <Chart
        width={460}
        height={180}
        padding={[0, 0, 0, 0]}
        data={props.data}
        autoFit
        position="left"
        onIntervalClick={(e) => {
          const states = e.target.cfg.element.getStates(); // 如果是选中，值为['selected'];取消选中，值为[]
        }}
        onGetG2Instance={(c) => {
          console.log(c.getXY(props.data[0]));
        }}
      >
        <Coordinate type="theta" radius={0.65} innerRadius={0.77} />
        <Tooltip showTitle={false} />
        <Axis visible={false} />
        <Legend
          position="right"
          offsetX={-50}
          itemHeight={18}
          itemName={{
            formatter: (text) => `${text} :`,
            style: {
              fill: '#333',
            },
          }}
          itemValue={{
            formatter: (_text, _item, index) => {
              let total = 0;
              const tarValue = props.data[index].value;
              for (let i = 0; i < props.data.length; i++) {
                total += props.data[i].value;
              }
              const p = Math.round((tarValue / total) * 100);
              return `${tarValue}G`;
            },
            style: {
              fill: '#1A1A1A',
              fontSize: 14,
            },
          }}
        />
        {/* 总容量 */}
        <Annotation.Text
          position={['50%', '46%']}
          content={props.data.map((item) => item.value).reduce((a, b) => a + b, 0)}
          style={{
            lineHeight: 40,
            fontSize: 22,
            fontWeight: 700,
            fill: '#1A1A1A',
            textAlign: 'center',
          }}
        />
        <Annotation.Text
          position={['50%', '57%']}
          content="总容量:G"
          style={{
            lineHeight: 32,
            fontSize: 16,
            fill: '#333',
            textAlign: 'center',
          }}
        />
        <Interval
          position="value"
          adjust="stack"
          color="type"
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        />
      </Chart>
    </div>
  );
};

export default PieCharts;
