import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProviders {
	channelid = 'UCGyPHwlkRV_Ai7aLRXpXJow';
	//channelid = 'UCZZPgUIorPao48a1tBYSDgg';
	apiKey = 'AIzaSyCigpYGgD6oSf4PfKLXn1f_kT7ADo01ak0';
	server: string = "http://localhost/projects/livingword/api/"; // default
	//server: string = "http://safomstore.com/livingword/api/"; // default
	// if you test in real device "http://localhost" change use the your IP	
    //server: string = "http://192.199.122.100/IONIC4_CRUD_LOGINREGIS_PHP_MYSQL/server_api/"; 

	constructor(public http : HttpClient) {

	}

	postData(body, file){
		let headers = new HttpHeaders({ 
            'Content-Type': "application/json; charset=UTF-8" 
        });
		let options = { 
            headers: headers 
        }

        return this.http.post(this.server + file, JSON.stringify(body), options)
        .timeout(59000)
		.map(res => res); 
	}



	getPlaylistsForChannel(channel) {
		return this.http.get('https://www.googleapis.com/youtube/v3/playlists?key=' 
		+ this.apiKey + '&channelId=' + channel + '&part=snippet,id&maxResults=20')
		
	}
	 
	getListVideos(listId) {
		return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' 
		+ this.apiKey + '&playlistId=' + listId +'&part=snippet,id&maxResults=20')
	}

	getSingleVideos() {
		return this.http.get('https://www.googleapis.com/youtube/v3/search?key=' 
		+ this.apiKey + '&channelId=' + this.channelid + '&part=snippet,id&maxResults=20&type=video&order=date');
	}

	getLiveVideos() {
		return this.http.get('https://www.googleapis.com/youtube/v3/search?key=' 
		+ this.apiKey + '&channelId=' + this.channelid + '&part=snippet,id&maxResults=20&type=video&eventType=live');
	}




}