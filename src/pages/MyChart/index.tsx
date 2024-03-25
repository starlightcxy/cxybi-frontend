import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPost} from "@/services/cxybi/chartController";
import {Avatar, Card, List, message} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@umijs/max";
import Search from "antd/es/input/Search";


/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
  };

  //定义状态
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  //从全局状态获取当前登录用户的信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  //加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // 获取数据。await将异步变同步，它执行完才继续后面的
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPost(searchParams);

      //res有code,data,message。用records：因为分页展示
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        //隐藏图表的title
        if(res.data.records){
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          })
        }
      } else {
        message.error('获取我的图表失败');
      }

    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  }

  //首次渲染或者搜索条件的状态更新就loadData（也就是重新搜索）
  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search placeholder="请输入图表名称" loading={loading} enterButton onSearch = {(value) => {
          //设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value
          })
        }}/>
      </div>
      <div className = "margin-16"></div>
      <List
        itemLayout="vertical"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? ('图表类型'+ item.chartType): undefined}
              />
              {'分析目标：' + item.goal}
              <div style = {{marginBottom : 16}}></div>
              <ReactECharts option={JSON.parse(item.genChart ?? '{}')}></ReactECharts>
            </Card>
          </List.Item>
        )}
      />
      总数：{total}
    </div>
  );
};
export default MyChartPage;
