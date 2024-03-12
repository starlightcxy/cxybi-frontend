import {UploadOutlined,} from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import React, {useState} from 'react';
import {genChartByAiUsingPost} from "@/services/cxybi/chartController";
import TextArea from "antd/es/input/TextArea";
import ReactECharts from 'echarts-for-react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {

  // 定义各个状态
  const [chart, setChart] = useState<API.BiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>();
  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    // 原先在控制台测试结果
    // console.log('表单内容', values);
    // todo 对接后端，上传数据
    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        //校验是否为空，同时将字符串转json
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误')
        } else {
          setChart(res.data);
          setOption(chartOption);
        }

      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              name="addChart" labelAlign="left" labelCol={{span: 5}}
              wrapperCol={{span: 16}}
              onFinish={onFinish}
              initialValues={{}}
            >

              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"></TextArea>
              </Form.Item>

              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入图表名称"/>
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
              >
                <Select
                  options={[
                    {value: '折线图', label: '折线图'},
                    {value: '柱状图', label: '柱状图'},
                    {value: '堆叠图', label: '堆叠图'},
                    {value: '饼图', label: '饼图'},
                    {value: '雷达图', label: '雷达图'},
                  ]}
                />
              </Form.Item>

              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传 CSV 文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 16, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning = {submitting}></Spin>
          </Card>
          <Divider></Divider>
          <Card title="生成图表">
            {
              option ? <ReactECharts option={option}/> : <div>请先在左侧进行提交</div>
            }
            <Spin spinning = {submitting}></Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
