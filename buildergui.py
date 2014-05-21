# eform GUI

from tkinter import *

class Application(Frame):
    ''' GUI for eforms '''

    def __init__(self, master):
        Frame.__init__(self, master)
        self.grid()
        self.label = {}
        self.create_widgets()

    def create_widgets(self):
        ''' Create interface widgets here '''
        # labels
        labels_keys = ["title",
                       "name",
                       "explanation"]
        labels_text = ["Form Title:",
                       "Header:",
                       "Explanation:"]
        for i in range(len(labels_keys)):
            self.label[labels_keys[i]] = Label(self, text = labels_text[i])
            self.label[labels_keys[i]].grid()
            
        # buttons
        # text boxes
        
        
root = Tk()
root.title("E-Form Builder")
root.geometry("500x500")

app = Application(root)

root.mainloop()
