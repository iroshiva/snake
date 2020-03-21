window.onload = function() 
{

	// dès le début, va charger
	// les variables de dimensions du canvas 
	var canvasWidth = 900;
	var canvasHeight = 600;

	// variable de taille des blocs qui vont constituer le serpent
	var blockSize = 30;

	// concerne le context du canvas
	var ctx;

	// delay de changement du canvas
	var delay = 100;

	// variable du serpent
	var snakee;
	
	// lancer la function init() qui va initialiser la partie
	init();


	// function initiée plus haut qui va être appliquer dès le chargement de la page : crée le canvas, le serpent et lance la function refreshCanvas()
	function init() 
	{

		// création du canvas
		var canvas = document.createElement('canvas');
		// document == document entier de notre page html

		// détermination de la taille du canvas + border
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border ="1px solid";

		// on attache le canvas à la page html
		document.body.appendChild(canvas);

		// on chope le contexte du canva
		ctx = canvas.getContext('2d');

		// création d'une instance snakee avec 3 blocs contenant chacun ses coordonnées x et y == serpent du début
		snakee = new Snake([[6, 4], [5, 4], [4,4]], "right");

		// appel de la fontion refreshCanvas
		refreshCanvas();
	}

	//sert à rafraîchir notre canvas au bout du delay fixé
	function refreshCanvas() 
	{

		// on efface le canvas d'avant
		ctx.clearRect(0,0,canvasWidth,canvasHeight);

		// on fait avancer le serpent ==> lance this.advance
		snakee.advance();

		// on dessine le serpent ==> lance this.draw qui lance entre autre la function drawblock() 
		snakee.draw();

		// permet de relancer la fonction refreshCanvas en fonction du delay que l'on met == permet de voir avancer le serpent
		setTimeout(refreshCanvas, delay);
	}

	// function lancée par snakee.draw
	function drawBlock(ctx, position) 
	{
		// def de x (nombre de block à partir de la gauche)
		var x = position[0] * blockSize;

		// def de y (nombre de block à partir du haut)
		var y = position[1] * blockSize;

		// dessiner le block
		ctx.fillRect(x, y, blockSize, blockSize);
	}

	// function constructeur !!!! == sorte de class d'instance ruby
	// le serpent a les caractéristiques données par l'instance snakee = new Snake([[6, 4], [5, 4], [4,4]], "right"); initiée plus haut
	function Snake (body, direction) 
	{

		// le serpent a un corps définit par le nombre de bloc et sa taille, ici [[6, 4], [5, 4], [4,4]]
		this.body = body;

		// le serpent avance dans une direction, ici "right"
		this.direction = direction;

		// fonction qui permet de dessiner le serpent, initié par snakee.advance (plus haut)
		this.draw = function() 
		{

			//sauvegarder le contxt du canvas d'avant
			ctx.save();

			// on donne une couleur aux blocs du serpent
			ctx.fillStyle = "#ff0000";
			
			// boucle for pour dessiner les blocs du serpent en fonction du body définit
			for(var i = 0; i < this.body.length; i ++) 
			{
				drawBlock(ctx, this.body[i]);
			}

			ctx.restore();

		};
		
		// fonction qui permet de faire avancer le serpent == nouvelle position de la tête + suppression dans l'ancienne position de la queue
		this.advance = function() 
		{

			// nouvelle position de la tête avec .slice qui va donner une copie de l'élément tête
			var nextPosition = this.body[0].slice();

			// prochaine position
			switch(this.direction) 
			{
				// cas où la direction initiée est à gauche
				case "left":
					nextPosition[0] -= 1;
					break;
				// cas où la direction initiée est à droite
				case "right":
					nextPosition[0] += 1;
					break;
				// cas où la direction initiée est vers le bas
				case "down":
					nextPosition[1] += 1;
					break;
				// cas où la direction initiée est vers le haut
				case "up":
					nextPosition[1] -= 1;
					break;
				default:
					// permet de lancer un message d'erreur
					throw("No valid direction");
			}

			// ajouter celle nouvelle position au this.body avec .unschift qui va permettre de l'ajouter en première place dans l'array direction
			this.body.unshift(nextPosition);

			// supprimer la position du dernier bloc == queue du serpent  == .pop()
			this.body.pop();
		}

		// permet de donner une direction avec les flèches du clavier
		this.setDirection = function(newDirection) 
		{
			var allowDirection;
			
			// direction actuelle
			// ex : si le serpent va à droite, possibilité d'aller en haut, en bas, MAIS pas à gauche et à droite (puisqu'il y va);)
			switch(this.direction) 
			{
				// si je vais à droite ou à gauche
				case "left":
				case "right":
					// mes directions permises sont
					allowDirection = ["up", "down"];
					break;

				// si je vais en haut ou en bas
				case "down":
				case "up":
					// mes directions permises sont
					allowDirection = ["left", "right"];
					break;
				default:
					// permet de lancer un message d'erreur
					throw("No valid direction");
			}

			if(allowDirection.indexOf(newDirection) > -1) 
			{
				this.direction = newDirection;
			}	
		}
	}

	// utilisation du clavier par l'utilisateur initié par .onload du début
	document.onkeydown = function handleKeyDown(e) 
	{

		// donne le code de la touche qui a été appuyée
		var key = e.keyCode;

		// création de la nouvelle direction en fonction de la touche
		var newDirection;

		switch(key) 
		{
			// flêche gauche 
			case 37:
				newDirection = "left";
				break;
			// fleche en haut
			case 38:
				newDirection = "up";
				break;
			// fleche D
			case 39:
				newDirection = "right";
				break;
			// fleche bas
			case 40:
				newDirection = "down";
				break;
			default:
			// si pas code correspondant, tu t'arrêtes
				return;
		}

		snakee.setDirection(newDirection);
	}

}