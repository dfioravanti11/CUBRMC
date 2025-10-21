// Matter.js module aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Events = Matter.Events;

class MathSymbolPhysics {
    constructor() {
        this.engine = null;
        this.render = null;
        this.world = null;
        this.symbols = [];
        this.mouseConstraint = null;
        this.ceiling = null;
        this.init();
    }

    init() {
        // Create engine
        this.engine = Engine.create();
        this.world = this.engine.world;
        
        // Disable gravity initially to allow custom falling animation
        this.engine.world.gravity.y = 0;
        
        // Create renderer
        this.render = Render.create({
            element: document.getElementById('physics-world'),
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
                showVelocity: false,
                showAngleIndicator: false,
                showDebug: false
            }
        });

        // Enable pointer events on physics canvas for dragging
        this.render.canvas.style.pointerEvents = 'auto';

        // Create boundaries (invisible walls)
        this.createBoundaries();
        
        // Create mouse constraint for dragging
        this.setupMouseConstraint();
        
        // Initialize symbols
        this.createSymbols();
        
        // Start the engine and renderer
        Engine.run(this.engine);
        Render.run(this.render);
        
        // Start falling animation
        this.startFallingAnimation();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    createBoundaries() {
        const thickness = 50;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Ground - move up slightly so symbols don't sink below the bottom edge
        const ground = Bodies.rectangle(width / 2, height + thickness / 2 -60, width + 100, thickness, {
            isStatic: true,
            render: { fillStyle: 'transparent' },
            restitution: 0.8,
            friction: 0.1
        });

        // Left wall - extend height to ensure full coverage
        const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height + 100, {
            isStatic: true,
            render: { fillStyle: 'transparent' },
            restitution: 0.8,
            friction: 0.1
        });

        // Right wall - extend height to ensure full coverage
        const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + 100, {
            isStatic: true,
            render: { fillStyle: 'transparent' },
            restitution: 0.8,
            friction: 0.1
        });

        World.add(this.world, [ground, leftWall, rightWall]);

        // Store references for resize handling
        this.ground = ground;
        this.leftWall = leftWall;
        this.rightWall = rightWall;
    }

    setupMouseConstraint() {
        const mouse = Mouse.create(this.render.canvas);
        this.mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.01, // Much lower stiffness for precise dragging
                render: {
                    visible: false
                }
            }
        });

        World.add(this.world, this.mouseConstraint);

        // Keep the mouse in sync with rendering
        this.render.mouse = mouse;

        // Only start drag when mouse is pressed and over a body
        let isDragging = false;
        
        Events.on(this.mouseConstraint, 'startdrag', (event) => {
            const body = event.body;
            if (body.symbolElement) {
                isDragging = true;
                body.symbolElement.style.cursor = 'grabbing';
                body.symbolElement.style.color = '#B31B1B';
                body.symbolElement.style.transform += ' scale(1.2)';
                
                // Reduce other forces while dragging
                Body.setAngularVelocity(body, 0);
                body.frictionAir = 0.5; // Increase air resistance while dragging
            }
        });

        Events.on(this.mouseConstraint, 'enddrag', (event) => {
            const body = event.body;
            if (body.symbolElement && isDragging) {
                isDragging = false;
                body.symbolElement.style.cursor = 'grab';
                body.symbolElement.style.color = '#333';
                body.symbolElement.style.transform = body.symbolElement.style.transform.replace(' scale(1.2)', '');
                
                // Restore normal air resistance
                body.frictionAir = 0.02;

                // Clamp body position inside viewport after drag ends
                const radius = body.circleRadius || 80;
                const minX = radius;
                const maxX = window.innerWidth - radius;
                const minY = radius;
                const maxY = window.innerHeight - radius;
                let newX = Math.min(Math.max(body.position.x, minX), maxX);
                let newY = Math.min(Math.max(body.position.y, minY), maxY);
                Body.setPosition(body, { x: newX, y: newY });
            }
        });
    }

    createSymbols() {
        const symbolElements = document.querySelectorAll('.symbol');
        const symbols = [
            { element: symbolElements[0], size: 160, mass: 1 }, // cube 
            { element: symbolElements[1], size: 180, mass: 0.8 }, // i 
            { element: symbolElements[2], size: 168, mass: 0.9 }, // e 
            { element: symbolElements[3], size: 152, mass: 1.1 }, // circle 
            { element: symbolElements[4], size: 140, mass: 0.7 }, // plus 
            { element: symbolElements[5], size: 160, mass: 1 }, // triangle 
            { element: symbolElements[6], size: 168, mass: 0.9 }, // pi
            { element: symbolElements[7], size: 120, mass: 0.6 }, // dot 
            { element: symbolElements[8], size: 180, mass: 0.8 }, // f 
            { element: symbolElements[9], size: 140, mass: 0.7 }, // multiply 
            { element: symbolElements[10], size: 168, mass: 0.9 }, // theta 
            { element: symbolElements[11], size: 200, mass: 1.2 }, // integral 
            { element: symbolElements[12], size: 160, mass: 1 }, // infinity 
            { element: symbolElements[13], size: 152, mass: 1.1 }, // angle 
            { element: symbolElements[14], size: 180, mass: 1 }, // sigma 
            { element: symbolElements[15], size: 120, mass: 0.8 }, // spade
            { element: symbolElements[16], size: 120, mass: 0.8 }, // clubs  
            { element: symbolElements[17], size: 180, mass: 1.2 }, // cIntegral
            { element: symbolElements[18], size: 190, mass: 1.1}, //starr
            { element: symbolElements[19], size: 200, mass: 1}, //equality
            { element: symbolElements[20], size: 180, mass: 0.9}, //delta
            { element: symbolElements[21], size: 200, mass: 0.7}, //div
            { element: symbolElements[22], size: 180, mass: 1} //sigma
        ];

        symbols.forEach((symbolData, index) => {
            if (symbolData.element) {
                const startX = Math.random() * (window.innerWidth - 200) + 100;
                const startY = -100 - (index * 80); 
                const body = Bodies.circle(startX, startY, symbolData.size / 2, {
                    restitution: 0.7,
                    friction: 0.4,
                    density: symbolData.mass * 0.001, 
                    frictionAir: 0.02, // Add air resistance
                    render: {
                        fillStyle: 'transparent'
                    }
                });

                // Store reference to DOM element and size
                body.symbolElement = symbolData.element;
                body.circleRadius = symbolData.size / 2;
                
                symbolData.element.style.pointerEvents = 'none';
                // Make symbol visible once positioned
                symbolData.element.style.opacity = '1';
                symbolData.element.style.visibility = 'visible';
                
                this.symbols.push(body);
                World.add(this.world, body);
            }
        });

        // Update DOM positions based on physics bodies
        this.updateSymbolPositions();
    }

    startFallingAnimation() {
        // Enable gravity after a short delay
        setTimeout(() => {
            this.engine.world.gravity.y = 0.8;
        }, 500);

        // Add some random initial velocities for more interesting falling
        setTimeout(() => {
            this.symbols.forEach((symbol, index) => {
                Body.setVelocity(symbol, {
                    x: (Math.random() - 0.5) * 2,
                    y: Math.random() * 2
                });
            });
        }, 1000);

        // Add ceiling once most symbols have entered the viewport
        setTimeout(() => {
            this.addCeiling();
        }, 3000);
    }

    updateSymbolPositions() {
        // Update DOM element positions to match physics bodies
        Events.on(this.engine, 'afterUpdate', () => {
            this.symbols.forEach(body => {
                if (body.symbolElement) {
                    // Use larger offset for bigger symbols (4x bigger needs more centering offset)
                    const offset = body.render.sprite ? body.render.sprite.xScale * 50 : 80;
                    body.symbolElement.style.left = `${body.position.x - offset}px`;
                    body.symbolElement.style.top = `${body.position.y - offset}px`;
                    body.symbolElement.style.transform = `rotate(${body.angle}rad)`;
                }
            });
        });
    }

    handleResize() {
        // Update renderer size
        this.render.canvas.width = window.innerWidth;
        this.render.canvas.height = window.innerHeight;
        this.render.options.width = window.innerWidth;
        this.render.options.height = window.innerHeight;

        // Remove old boundaries and create new ones
        const boundaries = this.world.bodies.filter(body => body.isStatic);
        World.remove(this.world, boundaries);
        this.createBoundaries();
        if (this.ceiling) {
            // recreate ceiling for new size
            this.ceiling = null;
            this.addCeiling();
        }
    }

    // Method to reset and restart the falling animation
    resetAnimation() {
        // Reset all symbol positions
        this.symbols.forEach((body, index) => {
            const startX = Math.random() * (window.innerWidth - 100) + 50;
            const startY = -100 - (index * 50);
            
            Body.setPosition(body, { x: startX, y: startY });
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setAngle(body, 0);
        });

        // Restart falling animation
        this.engine.world.gravity.y = 0;
        this.startFallingAnimation();
    }

    addCeiling() {
        if (this.ceiling) return; // already added
        const thickness = 50;
        const width = window.innerWidth;
        const ceilingBody = Bodies.rectangle(width / 2, -thickness / 2, width + 100, thickness, {
            isStatic: true,
            render: { fillStyle: 'transparent' },
            restitution: 0.8,
            friction: 0.1
        });
        this.ceiling = ceilingBody;
        World.add(this.world, ceilingBody);
    }
}

// Initialize physics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const physics = new MathSymbolPhysics();
    
    // Add refresh functionality for testing
    window.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            physics.resetAnimation();
        }
    });
    
    // Logo home button functionality
    const logoButton = document.querySelector('.logo-home-button');
    if (logoButton) {
        logoButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Reload the current page to go "home"
            window.location.reload();
        });
        
        // Add visual feedback for logo button
        logoButton.addEventListener('mousedown', () => {
            logoButton.style.transform = 'scale(0.95)';
        });
        
        // Clear inline transform after mouseup so future hovers use CSS rule
        logoButton.addEventListener('mouseup', () => {
            logoButton.style.transform = '';
        });
        
        // Also clear when leaving the logo button
        logoButton.addEventListener('mouseleave', () => {
            logoButton.style.transform = '';
        });
    }
    
    window.mathPhysics = physics;


}); 