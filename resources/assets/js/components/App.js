import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            completed:false,
            buttonTxt:'Create',
            showShare:false,
            shareID:'',
            users:[],
            tasks: [],
            sharedTasks:[]
        };
     
        
        // bind
        this.handleChange = this.handleChange.bind(this);

    // bind handleSubmit method
this.handleSubmit = this.handleSubmit.bind(this);
this.renderTasks = this.renderTasks.bind(this);
this.handleDelete = this.handleDelete.bind(this);
this.handleComplete = this.handleComplete.bind(this);
this.handleEdit = this.handleEdit.bind(this);
this.handleUpdate = this.handleUpdate.bind(this);
this.toggleShare = this.toggleShare.bind(this);
this.doShare = this.doShare.bind(this);
    }
    
    // handle change
    handleChange(e) {
        this.setState({
            name: e.target.value,
        });
        console.log('onChange', this.state.name);
    }


// create handleSubmit method right after handleChange method
handleSubmit(e) {
    e.preventDefault();

        axios
            .post('/tasks', {
                name: this.state.name
            })
            .then(response => {
                console.log('from handle submit', response);
                // set state
                this.setState({
                    tasks: [response.data, ...this.state.tasks]
                });
                // then clear the value of textarea
                this.setState({
                    name: '',
                    completed:false
                });
            });
    }
    handleUpdate(e) {
        e.preventDefault();
    
            axios
                .put('/tasks/'+this.state.id, {
                    name: this.state.name
                })
                .then(response => {
                    console.log('from handle update', response);
                    // set state
                    // this.setState({
                    //     tasks: [response.data, ...this.state.tasks]
                    // });
                    this.state.tasks.map(item => {
                        if (item.id === this.state.id)
                          item.name = this.state.name;
                        
                        return item;
                      });
                   
                    // then clear the value of textarea
                    this.setState({
                        name: '',
                    });
                });
        }
    renderTasks() {
   
        return this.state.tasks.map(task => (
            
            <div key={task.id} className="media">
                <div className="media-body">
                    <p>
               
                        <span className={"task-txt " +(task.completed ? "done" : "")}>{task.name}{' '}</span>
                        <button
                            onClick={() => this.handleDelete(task.id)}
                            className="btn btn-sm btn-danger float-right"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => this.handleEdit(task)}
                            className="btn btn-sm btn-primary float-right"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => this.toggleShare(task.id)}
                            className="btn btn-sm btn-info float-right"
                        >
                            Share
                        </button>
                        <input type="checkbox" value={task.completed} defaultChecked={task.completed} onClick={() => this.handleComplete(task.id)}   id={'task_'+task.id}  className="checkbox checkbox--checkbox checkbox--success" tabIndex="1" />
        <label htmlFor= {'task_'+task.id}  className="checkbox__label"></label>
                    </p>
                </div>
            </div>
        ));
    }
    renderTasksShared() {
     
        return this.state.sharedTasks.map(task => (
            <div key={task.id} className="media">
                <div className="media-body">
                    <p>
                   
                    <span className={"task-txt " +(task.completed ? "done" : "")}> {task.name}{' '} </span>
                     
                
                      
        <input type="checkbox" value={task.completed} defaultChecked={task.completed} onClick={() => this.handleComplete(task.id)}   id={'task_'+task.id}  className="checkbox checkbox--checkbox checkbox--success" tabIndex="1" />
        <label htmlFor= {'task_'+task.id}  className="checkbox__label"></label>
                    </p>
                </div>
            </div>
        ));
    }
    getShared() {
        axios.post('/tasks/sharedWithMe',{}).then((
            response // console.log(response.data.tasks)
        ) =>{
           
            this.setState({
                sharedTasks: [...response.data.shared_tasks]
            })
        }
            
        );
    }
    getTasks() {
        axios.get('/tasks').then((
            response // console.log(response.data.tasks)
        ) =>
            this.setState({
                tasks: [...response.data.tasks],
                users:[...response.data.OtherUsers]
            })
        );
    }
    getOtherUsers() {
        axios.get('/tasks/OtherUsers').then((
            response // console.log(response.data.tasks)
        ) =>
            this.setState({
                users: [...response.data.users]
            })
        );
    }
    // lifecycle method
    componentWillMount() {
      
        this.getTasks();
        this.getShared();
    }
    handleEdit(task) {
        this.setState({
            id:task.id,
            name: task.name,
            buttonTxt:'Update'
        });
        console.log('onChange', this.state.name);
    }

    handleDelete(id) {
        // remove from local state
        const isNotId = task => task.id !== id;
        const updatedTasks = this.state.tasks.filter(isNotId);
        this.setState({ tasks: updatedTasks });
        // make delete request to the backend
        axios.delete(`/tasks/${id}`);
    }
    handleComplete(id) {
        // remove from local state
        // const isNotId = task => task.id !== id;
        // const updatedTasks = this.state.tasks.filter(isNotId);
        // this.setState({ tasks: updatedTasks });
        // make delete request to the backend
        axios
        .post('/tasks/complete', {
            id: id
        })
        .then(response => {
            
        this.state.tasks.map((task) => {
            if (task.id === id)
                task.completed = !task.completed;
        
  
            return task;
          });
          this.state.sharedTasks.map((task) => {
            if (task.id === id)
                task.completed = !task.completed;
        
  
            return task;
          });
          this.setState({
            name: '',
        });
          console.log('from handle complete', this.state.tasks);
        
        });
    }

  doShare(userID){
 
    this.setState({ showShare: false });
    axios
    .post('/tasks/share/'+userID, {
        task_id: this.state.shareID,
        user_id:userID
    })
    .then(response => {
        
        // then clear the value of textarea
        this.setState({
            shareID: ''
        });
    });

 }
    toggleShare(shareId) {
        console.log(shareId);
        this.setState({
            shareID:shareId,
            showShare: !this.state.showShare
        });
    }
    

 
      
    render() {

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header"><h4><b>Create TODO</b></h4></div>
                            <div className="card-body">
                                <form > 
                                    <div className="form-group">
                                        <textarea
                                          onChange={this.handleChange}
                                          value={this.state.name}
                                          className="form-control"
                                          rows="5"
                                          maxLength="255"
                                          placeholder="Create a new todo"
                                          required
                                        />
                                    </div>
                                    {this.state.id?(<button type="submit" onClick={this.handleUpdate} className="btn btn-primary">
                                    {this.state.buttonTxt}
                                    </button>):(<button type="submit" onClick={this.handleSubmit} className="btn btn-primary">
                                    {this.state.buttonTxt}
                                    </button>)
                                    }
                                    
                                </form>
                                <hr />
       

                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showShare} handleClose={this.toggleShare} shareTask={this.doShare}  >

                <div className="row container">
                <div className="col-md-6">
                <h4><b>Select a user to share</b></h4>
              
                {this.state.users.map((user,i) =><p key={i}><b>{user.name}</b>{' '+user.email }<button className="btn btn-info" onClick={() => this.doShare(user.id)} >{this.state.showShare}Share </button></p> ) }
              

                </div>
                </div>

       
        </Modal>
                <div className="row justify-content-center">
              
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><h4><b>My Todos</b></h4></div>
                            <div className="card-body">
                            {this.renderTasks()}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><h4><b>Todos shared with me</b></h4></div>
                            <div className="card-body">
                            {this.renderTasksShared()}
                            </div>
                        </div>
                    </div>
                    </div>
            </div>
        );
    }
}
const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  
    return (
      <div className={showHideClassName}>
        <section className='modal-main'>
          {children}
          
          <button className="btn btn-primary" onClick={handleClose}>Close </button>
         
        </section>
      </div>
    );
  };

