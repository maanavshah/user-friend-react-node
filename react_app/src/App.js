import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import './App.css';

export default class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          data: [],
          perPage: 3,  // can be changed as per page request
          currentPage: 0
      };
      this.handlePageClick = this
          .handlePageClick
          .bind(this);
  }
  receivedData() {
      axios
          .get(`http://localhost:8000/fetch_users`)
          .then(res => {
              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(pd => <React.Fragment>
                  <p style={{marginLeft: 10 + 'em'}}>{pd.id}</p>
                  <p style={{marginLeft: 10 + 'em'}}>{pd.name}</p>
                  <p style={{marginLeft: 10 + 'em'}}>{pd.email}</p>
                  <br/>
              </React.Fragment>)
              this.setState({
                  pageCount: Math.ceil(data.length / this.state.perPage),
                  postData
              })
          });
  }
  handlePageClick = (e) => {
      const selectedPage = e.selected;
      const offset = selectedPage * this.state.perPage;

      this.setState({
          currentPage: selectedPage,
          offset: offset
      }, () => {
          this.receivedData()
      });

  };
  componentDidMount() {
      this.receivedData()
  }
  render() {
      return (
          <div>
              {this.state.postData}
              <ReactPaginate
                  previousLabel={"prev"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}/>
          </div>
      )
  }
}
