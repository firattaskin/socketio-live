app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
	
	$scope.messages = [];
	$scope.players = [];

	$scope.baslangic = () => {
		const username = prompt('Please Enter username');
		if(username){
			initSocket(username);
		}
	};

	function initSocket(username){
		const options = {
			reconnectionAttempts:3,
			reconnectionDelays:500
		};

		indexFactory.connectSocket('http://localhost:3000',options)
		.then((socket)=>{
			socket.emit('newUser',{username});

			socket.on('initPlayers',(users)=>{
				$scope.players = users;
				$scope.$apply();
			});

			socket.on('newUser',(user)=>{
				const messageData = {
					type:{
						code:0
					},
					text: "bağlandı.",
					username: user.username
				};
				$scope.messages.push(messageData);
				$scope.players[user.id] = user;
				$scope.$apply();
			});

			socket.on('disUser',(user)=>{
				const messageData = {
					type:{
						code:0
					},
					text: "ayrıldı.",
					username: user.username
				};
				$scope.messages.push(messageData);
				delete $scope.players[user.id];
				$scope.$apply();
			});	

			socket.on('animate',(data)=>{
				$('#'+data.socketId).animate({'left':data.x,'top':data.y});
			});

			let animate = false;
			$scope.onClickPlayer = ($event) => {
				if(!animate){

					let x = $event.offsetX;
					let y = $event.offsetY;

					socket.emit('animate',{x,y});

					animate = true;
					$('#'+socket.id).animate({'left':x,'top':y});
					animate = false;
				}
			};
		}).catch((err)=>{
			console.log(err);
		});
	}
}]);

