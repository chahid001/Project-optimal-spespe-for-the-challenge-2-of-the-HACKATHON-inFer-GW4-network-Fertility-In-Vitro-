import matplotlib
# Set the backend before importing pyplot
matplotlib.use('Agg')
import matplotlib.pyplot as plt 
import pandas as pd 
import numpy as np 
from io import BytesIO
import base64
import os
from django.db import models
import pandas as pd 
from bio import views
import requests

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Meta:
    app_label = 'bio'

var_name = ''

def ploting_beat_pattern(path_file, tau):
    if tau == -1:
        tau = 5
    else:
        tau = int(tau)

    try:
        data = pd.read_csv(path_file)
    except FileNotFoundError:
        print(f"Error: File {path_file} not found.")
        return None

    fig, ax1 = plt.subplots()

    for i in list(np.linspace(0, len(data)-1, tau).astype(int)):
        row_data = data.iloc[i]
        x = row_data.iloc[2:1001]
        y = row_data.iloc[1002:2001]
        ax1.plot(x, y)

    # Create a directory to save the plot image if it doesn't exist
    output_dir = '../frontend/plot_images'
    os.makedirs(output_dir, exist_ok=True)

    # Take the name from csv
    pic_name = path_file.split("/")[-1].split(".")[0]
    global var_name
    pic_name = pic_name + '.jpeg'

    # Save the plot as an image file
    output_path = os.path.join(output_dir, pic_name)
    plt.savefig(output_path)
    # Close the plot to release resources
    plt.close()
    var_name = "../plot_images/" + pic_name
    return output_path




def reshaping_data(path):
    data = pd.read_csv(path)
    dic = {}
    i = 1
    j = 1001
    alpha = 1000/(data["flagellum_length"].iloc[0])
    for a in range(2,10):
        i += 1
        j += 1
        x = list(data["Unnamed: " + str(i)].iloc[:100])
        y = list(data["Unnamed: " + str(j)].iloc[:100])
        couple = {"x_"+str(i) : x, "y_"+str(i): y}
        dic.update(couple)
    return  pd.DataFrame(dic)


# Hard coded at l 1 dial lil fia n3as a 3ibad lah
def check_data(file, options):
    range = -1 

    if options[0] == 'Custom':
        range = options[1]

    # ff = reshaping_data(file)
    
    ploting_beat_pattern(file, range)

    # print(f"Graph: {Graph}")
    # print(f"Standard: {Standard}")
    # print(f"Custom: {Custom}")
    # print(f"X: {X}")
    # print(f"Y: {Y}")
    # print(f"Report: {Report}")
    # print(f"Result: {Result}")
    
