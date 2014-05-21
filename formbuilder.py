import os
import shutil
import re

class Option:
    ''' answer options and their attributes can be set here '''

    def __init__(self, style, owner, value, text, left='', top='', place=''):
        self.style = style
        self.owner = owner
        self.value = value
        if not "IMG:" in text:
            self.text = text
        else:
            self.text = ''
            things = []
            before = re.compile('(.*?).IMG:')
            r = re.compile('IMG:(.*?)NUM:')
            per_row = re.compile('NUM:(.*?)HEIGHT:')
            h = re.compile('HEIGHT:(.*?)')
            things.append(before.search(text))
            things.append(r.search(text))
            things.append(per_row.search(text))
            things.append(h.search(text))
            pieces = []
            for val in things:
                if val:
                    pieces.append(val.group(1))
            size = int(12 / int(pieces[2]))
            string = "{0}<br/><img src='{1}' class='col-md-{2}' height='{3}px'>".format(pieces[0], pieces[1],size,  pieces[3])
            debug("---IMAGE LOCATION---\n{0}".format(pieces[1]))
            shutil.copyfile(pieces[1], name + '\\' + pieces[1])
            self.text = string
                    
                
                
        self.left = left
        self.top = top
        self.name = place
        
    def string(self):
        string = ""
        if self.style == "diagram":
            debug("CHECKBOX LOCATION:\n")
            debug(str(self.left))
            debug(str(self.top))
            
            string= "<input type=\"checkbox\" name=\"{0}\" value=\"{1}\" style=\"left:{2}px; top:{3}px;\">\n".format(self.owner, self.value, self.left, self.top)
        elif self.style == "textarea":
            string = "<textarea class=\"form-control\" rows=\"{1}\" name=\"{0}\">{2}</textarea>\n".format(self.owner, self.value, self.text)
        else:
            string = "<div class=\"{0} answer col-md-8\"><label><input type=\"{0}\" name=\"{1}\" value=\"{2}\">{3}</label></div>\n".format(self.style, self.owner, self.value, self.text)

        return string
    

class Question:
    ''' question objects that will act as containers for the questions '''
    qCount = 0

    # constructor
    def __init__(self, question='', style='', picture='', options=[]):
        self.style = style
        self.question = question
        self.picture = picture
        self.options = []
        Question.qCount += 1
        self.order = Question.qCount

    def number(self):
        return 'q' + str(self.order)

    def add_option(self, value, text, top='', name=''):
        if top != '' :
            debug('COORDINATES BEING ENTERED: {0}, {1}, {2}'.format(value, text, top))
            opt = Option(self.style, self.number(), value, text, text, top, name)
        else:
            opt = Option(self.style, self.number(), value, text)
            debug('NAME: {0}'.format(name))
        self.options.append(opt)

    def del_option(self, value):
        for opt in self.options:
            if opt.value == value:
                del opt

    def string(self):
        string = "<!-- {0} question --><div class=\"{0} question col-md-12\"><h3 class=\"col-md-12\">{1}</h3><div class=\"{0} col-md-8\">\n".format(self.style, self.question)
        if self.style == "diagram":
            string += "<figure class=\"diagram\"><img src=\"{0}\" width=\"100%\">\n".format(self.picture);

        debug("Number of options: " + str(len(self.options)))
        for opt in self.options:
            string += opt.string()
            if opt.name != '':
                shutil.copyfile(self.picture, name + '\\' + self.picture)
                debug("----- PICTURE COPY SUCCESSFUL -----")

        if self.style == "diagram":
            string += "</figure>"

        string += "</div></div>"
        return string
        

# parses input file
def parse_option(value):
    strings = value.split(', ');
    debug("Parse values: " + ''.join(strings))
    return strings

deb = 0 # debug variable. if 1, then will debug values given
fdeb = open("debug.txt", 'w') # debug file where output goes

# debug function takes a value and writes it to a debug file
# or to the screen if the active debugging channel is activated
def debug(value):
    if(deb):
        print(value)
    fdeb.write(value + '\n')
    fdeb.flush()
    
# all the files that will be accessed for static strings
files = ['header_info.txt',
         'container_start.txt',
         'patient_info_start_form.txt',
         'close_form_jquery.txt',
         'close_jquery_file.txt'];

		 
debug("------ CURRENT WORKING DIRECTORY -----\n" + os.getcwd())
debug("------ FILES IN DIRECTORY -----\n" + ''.join(os.listdir()))

copy_files = ['bootstrap.min.css',
              'bootstrap.min.js',
              'template.css',
              'my_styles.css'];

strings = []
copy_strings = []

# store all the lines of the files in separate string values
for file in files:
    f = open(file, 'r')
    debug("----- OPENING FILE -----")
    info = f.read()
    strings.append(info)
    debug("----- ADDED FILE TO LIST -----\n" + info)
    f.close()
    debug("----- CLOSED FILE -----")

# input file where this code gets its inputs
finput = open("input.txt", 'r')
debug("----- READING INPUTS -----")

name = finput.readline()[:-1]
header = finput.readline()[:-1]
explanation = finput.readline()[:-1]

if not os.path.exists(name + '\\'):
    os.makedirs(name + r'\\')

# get all the copiable files
for file in copy_files:
    shutil.copyfile(file, name+'\\'+file)


debug("----- NAME -----\n" + name
      + "\n----- HEADER -----\n" + header
      + "\n----- EXPLANATION -----\n" + explanation)


# output file for the final product
foutput = open(name + '\\' + name + ".html", 'w')
debug("----- OPENED NEW FORM -----")

#next section of file will be questions
question_lines = []
while True:
    array = []

    debug("----- NEW QUESTION -----")
    while True:
        inp = finput.readline()[:-1]
        if(inp != "end" and inp != "endquestions"):
            array.append(inp)
            debug(inp)
        else:
            if len(array) > 0:
                question_lines.append(array)
                debug('----- ADDED QUESTION -----')
            break

    if(inp == "endquestions"):
        debug("----- NO FURTHER QUESTIONS -----")
        break

# collect final pieces of the file
pieces = []
debug("----- COLLECTING PHRASES -----")
while True:
    piece = finput.readline()[:-1]
    if not piece: break
    else:
        pieces.append(piece)
        debug(piece)

debug("----- NO FURTHER PHRASES -----")
# close the input file
finput.close()
debug("----- CLOSED INPUT FILE -----")


questions = []
debug("----- NUMBER OF QUESTIONS -----\n" + str(len(question_lines)) + "\n")
# parse question information
for qset in question_lines:
    if deb:
        debug("----- A Question Line -----")
        for q in qset:
            debug("----- A question piece -----")
            debug(q)
                  
    # get the actual question and the style, and diagram if necessary
    options = []

    # Question(question text, style [, image link]) 
    if qset[1] != "diagram":
        q = Question(qset[0], qset[1])
        options = qset[2:]
        debug("----- OPTIONS -----")
        for opt in options:
            debug(opt + ", " + str(len(opt)))
    else:
        q = Question(qset[0], qset[1], qset[2])
        debug("----- DIAGRAM -----")
        options = qset[3:]

    debug("----- CREATED QUESTION -----")
    debug("Type: " + q.style)


    # Option(value, text [, left [,top] ] )
    for opt in options:
        
        values = parse_option(opt)
        debug("Number of options: " + str(len(values)))
        if(len(values) > 2):
            debug("MORE OPTIONS")
            q.add_option(values[0], values[1], values[2], name)
        else:
            q.add_option(values[0], values[1])

        debug("----- ADDED OPTION -----")
        
    questions.append(q)
    debug("----- ADDED QUESTION -----")

# file construction phase
# question construction
question_text = ""

for q in questions:
    question_text += q.string()
    debug("----- QUESTION STRING -----")
    debug(q.string())
    

p_text = ""
# pieces construction
for p in pieces:
    p_text += '\"' + p + '\"' + ',\n'

p_text = p_text[:-2] # truncate the last two characters out
debug("----- PIECES -----")
debug(p_text)

# file construction
# 0: heading of document
# 1: title
# 2: container
# 3: header
# 4: explanation
# 5: patient info + form start
# 6: question text
# 7: form end
# 8: pieces
# 9: close document
final = "{0}<title>{1}</title>{2}<h1>{3}</h1><p class=\"lead\">{4}</p>{5}{6}{7}pieces=[{8}];{9}".format(strings[0],name,strings[1],header, explanation, strings[2], question_text, strings[3], p_text, strings[4])

foutput.write(final)
foutput.close()

    
    



