import os
from os.path import *
import shutil
import re
import Builder
from flask import *

app = Flask(__name__)
@app.route('/')
def index():
	return render_template('index.html')
	
@app.route('/test')
def test():
	return redirect(url_for('static', filename='test.html'))
	
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		file = request.files.getlist('the_file[]')
		if file:
			for f in file:
				filename = f.filename
				f.save(os.path.join('img', filename))
			return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
	if request.method == 'POST':
		file = open('input.txt', 'w')
		file.write(request.form['message'])
		file.close()
		Builder.create_new_page()
	return render_template('index.html')
			
@app.route('/img')
def get_image():
	name = request.args.get('name')
	filename = os.path.join('img', name)
	return send_file(filename, mimetype='image/gif')
		
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
