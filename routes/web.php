<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::resource('tasks', 'TaskController');
Route::post('/tasks/complete', 'TaskController@complete');
Route::post('/tasks/OtherUsers', 'TaskController@OtherUsers');
Route::post('/tasks/share/{id}', 'TaskController@share');
Route::post('/tasks/sharedWithMe', 'TaskController@sharedWithMe');
