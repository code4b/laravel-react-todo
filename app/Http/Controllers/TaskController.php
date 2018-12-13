<?php

namespace App\Http\Controllers;
use Auth;
use App\User;
use App\Task;
use Illuminate\Http\Request;
use DB;

class TaskController extends Controller {
 // apply auth middleware so only authenticated users have access
	public function __construct() {
		$this->middleware('auth');
	}

	public function index(Request $request, Task $task) {
		// get all the tasks based on current user id
		$allTasks = $task->whereIn('user_id', $request->user())->with('user');
        $tasks = $allTasks->orderBy('created_at', 'desc')->get();
        $users = User::where('id', '!=', Auth::id())->get();
		// return json response
		return response()->json([
            'tasks' => $tasks,
            'OtherUsers'=> $users
		]);
	}

	public function create() {
		//
    }
    public function OtherUsers() {
        $users = User::where('id', '!=', Auth::id())->get();
        return response()->json([
			'users' => $users,
		]);
    }
    public function sharedWithMe(Task $task) {
        $shared_tasks = DB::table('shared_tasks')->where('shared_with', Auth::id())->pluck('task_id');
         $allTasks = $task->whereIn('id', $shared_tasks);
         $tasks = $allTasks->orderBy('created_at', 'desc')->get();
        return response()->json([
            'shared_tasks' => $tasks
		]);
	}
    public function share($userId,Request $request) {
        $shared_tasks = DB::table('shared_tasks');
        $shared_tasks = $shared_tasks->insert([
            'task_id' => $request->get('task_id'),
            'shared_with'=>$userId,
            "created_at" =>  \Carbon\Carbon::now(), # \Datetime()
            "updated_at" => \Carbon\Carbon::now(),  # \Datetime()
		]);
        return response(200);
	}
	public function store(Request $request) {
		// validate
		$this->validate($request, [
			'name' => 'required|max:255',
		]);
		// create a new task based on user tasks relationship
		$task = $request->user()->tasks()->create([
            'name' => $request->name,
            'completed'=>false,
		]);
		// return task with user object
		return response()->json($task->with('user')->find($task->id));
	}

	public function show($id) {
		//
	}

	public function edit($id) {
        $task = Task::find($id);
        return response()->json($task);
	}

    public function update($id,Request $request)
    {
        $task = Task::find($id);
        $task->name = $request->get('name');
        $task->save();

        return response()->json($task->with('user')->find($task->id));
    }
    public function complete(Request $request) {
        $id=$request->get('id');
        $task =  Task::find($id);
        if(!is_null($task)){
            $task->completed=!$task->completed;
            $task->update();
        }
        return response(200);
	}
    public function destroy($id) {
        Task::findOrFail($id)->delete();
    }
}
