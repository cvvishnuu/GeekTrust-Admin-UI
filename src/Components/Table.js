import React, { Component } from  'react';
import { Table, Button, Input, Spin } from 'antd';
import axios from 'axios';


const { Search } = Input;


const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: "50%",
    editable: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "50%",
    editable: true,
  },
  {
    title: "Role",
    dataIndex: "role",
    width: "50%",
    editable: true,
  },
  {
    title: 'Actions',
    dataIndex: 'action',
  },
  
];


class EditableTable extends Component {
    constructor() {
        super()
        this.state = {
            selectedRowKeys: [],        
            selectedRows: '',
            loading: false,
            data: [],
            filter: '',
        };
    }

    componentDidMount() {
        axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then(res => {
            let dataList = res.data.map(data => {
                let temp = Object.assign({}, data);
                temp.key = data.id;
                return temp;
            })
            this.setState({
                data: dataList
            })  
        })        
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.filter !== prevState.filter) {
        this.setState({
          data: this.state.data &&
          this.state.data.filter((item) => {
            return Object.keys(item).some((key) =>
              item[key].toLowerCase().includes(this.state.filter)
            );
          })
        })
      }
    }

    deleteSelectedRow = () => {      
        const idArray = this.state.selectedRows.map((e) => e.id);
        this.setState({
            data: this.state.data.filter((item) => {
                return !idArray.includes(item.id);
              })
        })        
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    onSearchChange = (e) => {
      this.setState({
        filter: e.target.value
      })
      if(this.state.loading) {
        return <Spin/>
      }
    }

    render() {
        const { loading, selectedRowKeys, data } = this.state;
        const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
        <>          
          <div style={{padding: "5vh 25vw"}}>
            <Search
              placeholder="Search by name, email or role"
              onChange={this.onSearchChange}
              enterButton
            />
              <div style={{ marginBottom: 16 }}>
              <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
              <Button style= {{borderRadius: '10px'}} type="danger" onClick={this.deleteSelectedRow} disabled={!hasSelected} loading={loading}>
                  Delete
              </Button>
          </div>
        </>
        );
    }
}

export default EditableTable;   