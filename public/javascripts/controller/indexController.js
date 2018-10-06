app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
	
	$scope.messages = [];


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
			console.log('bağlantı gerçekleşti.',socket);

			socket.on('newUser',(user)=>{
				const messageData = {
					type:{
						code:0
					},
					text: "bağlandı.",
					username: user.username
				};
				$scope.messages.push(messageData);
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
				$scope.$apply();
			});
		}).catch((err)=>{
			console.log(err);
		});
	}
}]);

