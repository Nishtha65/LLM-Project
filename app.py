from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Sample grid data
def generate_grid(size):
    return [[random.choice(['red', 'blue', 'green', 'yellow', 'purple']) for _ in range(size)] for _ in range(size)]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/grid')
def grid():
    grid = generate_grid(8)  # 8x8 grid
    return jsonify(grid)

if __name__ == '__main__':
    app.run(debug=True)

