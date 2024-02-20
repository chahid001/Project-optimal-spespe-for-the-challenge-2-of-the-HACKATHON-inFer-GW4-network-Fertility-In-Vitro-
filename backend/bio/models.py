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
from fpdf import FPDF

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Meta:
    app_label = 'bio'

var_name = ''
var_name_per = ''
var_name_in = ''
var_name_per_in = ''
var_report = ''

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
    global var_name_in
    pic_name = pic_name + '.jpeg'
    var_name_in = output_dir + "/" + pic_name
    # Save the plot as an image file
    output_path = os.path.join(output_dir, pic_name)
    plt.savefig(output_path)
    # Close the plot to release resources
    plt.close()
    var_name = "../plot_images/" + pic_name
    return output_path

def ploting_period(file_path): # This funct save a plotting of a period 
    data = pd.read_csv(file_path)
    fig, ax2 = plt.subplots(1 , figsize=(15,15))
    Y = list(data["Unnamed: 1502"])

    Y = pd.Series(Y)
    x =np.linspace(0,99,100)
    ax2.plot(x,Y)
    ax2.legend(['Period of a the mid_point'],fontsize = 20.0)
    ax2.set_xlabel("time (seconds)", fontsize = 20.0)
    ax2.set_ylabel("amplitud (Y) (µm)",fontsize = 20.0)


    # Create a directory to save the plot image if it doesn't exist
    output_dir = '../frontend/plot_images_per'
    os.makedirs(output_dir, exist_ok=True)

    # Take the name from csv
    pic_name = file_path.split("/")[-1].split(".")[0]
    global var_name_per
    global var_name_per_in

    pic_name = pic_name + '.jpeg'
    var_name_per_in = output_dir + "/" + pic_name
    # Save the plot as an image file
    output_path = os.path.join(output_dir, pic_name)
    plt.savefig(output_path)
    # Close the plot to release resources
    plt.close()
    var_name_per = "../plot_images_per/" + pic_name
    return output_path

def find_velocity(data):
    Y = data["Unnamed: 1500"]
    T = find_periode(data)
    v = (np.abs(max(Y)-min(Y))/2)/data["period"].dropna()
    return v.iloc[0]


def find_periode(data, ex = True):
    if ex:
        P = data["period"].iloc[0]
        return P
    else : 
        P = 0
        return P
        """Y = list(data["Unnamed: 1502"])

        Y = pd.Series(Y)
        x =np.linspace(0,99,100)
        plt.scatter(x,Y)
        f = Y
        g = x*0 +Y.mean()
        plt.plot(x, g)

        idx = np.argwhere(np.diff(np.sign(f - g))).flatten()
        plt.plot(x[idx], f[idx], 'ro')
        plt.show()
        print(x[idx],f[idx])
        return max(x[idx])-min(x[idx])"""

def cutting_off(period, length, Velocity, fresh = True):
        
        if fresh :
                Fresh_Minimal = [period < 0.39 and period>=0.1, length<58.45 and length>=57, Velocity<37.87 and Velocity>=36]

                Fresh_Optimal = [period >= 0.39, length >=58.45, Velocity>37.87]

        
                if sum(Fresh_Minimal) >= 2 :
                        results = "Fresh_Minimal"
                elif sum(Fresh_Optimal) >= 2 :
                        results = "Fresh_Optimal"
                else: 
                        results = "We think it's blebbed"
        else:
                Frozen_Minimal = [period < 0.17 and period>=0.1, length<57.81 and length>=57, Velocity<34.92 and Velocity>=36]

                Frozen_Optimal = [period >= 0.17, length >=57.81, Velocity>34.92]


                if sum(Fresh_Minimal) >= 2 :
                        results = "Frozen_Minimal"
                elif sum(Frozen_Optimal) >= 2 :
                        results ="Frozen_Optimal"
                else: 
                        results = "We think it's blebbed"
        
    
        return results

def report(path_data, img_path, per_img_path, fresh):
    
    data = pd.read_csv(path_data)
    velocity = find_velocity(data)
    length = data["flagellum_length"].iloc[0]
    P = find_periode(data)
    result = cutting_off(P, length,velocity, fresh)

    velocity = '{0:.3g}'.format(velocity) 
    # save FPDF() class into a 
    # variable pdf
    pdf = FPDF()
    
    # Add a page
    pdf.add_page()

    pdf.set_font("Arial", size = 28)
    
    # create a cell
    pdf.cell(200, 10, txt = "MetaData Of The Swimmer", 
            ln = 1, align = 'C'  )

    pdf.image(per_img_path, x=20, y=50, w=100, h=75)



    pdf.set_font("Arial", size = 12, style="I")

    pdf.set_y(70)
    pdf.set_x(130)

    pdf.cell(250, 10, txt = f"The period is : {P} (s)" , 
            ln = 1)
    pdf.set_x(130)
    pdf.cell(250, 10, txt = f"The flagellum length is : {length} (µm)", 
            ln = 1  )
    pdf.set_x(130)
    pdf.cell(250, 10, txt = f"The Velocity is : {velocity} µm/s" , 
            ln = 1 )
    pdf.set_x(120)
    
    pdf.set_font("Arial", size = 16, style="B")
    pdf.cell(250, 10, txt = f"Result = {result}" , 
            ln = 1 )
    pdf.set_x(130)



    pdf.set_font("Arial", size = 16)

    pdf.set_x(0)
    pdf.set_y(140)

    pdf.cell(200, 10, txt = "Graph" , 
            ln = 1, align ="C")
    
    pdf.image(img_path,x=25, y=150, w=170, h=150)



    output_dir = '../frontend/Reports'
    os.makedirs(output_dir, exist_ok=True)

    report_name = path_data.split("/")[-1].split(".")[0]

    report_name = report_name + '.pdf'
    global var_report

    var_report = "../Reports/" + report_name
    # Save the plot as an image file
    output_path = os.path.join(output_dir, report_name)

    pdf.output(output_path) 


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
    ploting_period(file)
    print(var_name_in)
    print(var_name_per_in)
    report(file, var_name_in, var_name_per_in, True)    


    # print(f"Graph: {Graph}")
    # print(f"Standard: {Standard}")
    # print(f"Custom: {Custom}")
    # print(f"X: {X}")
    # print(f"Y: {Y}")
    # print(f"Report: {Report}")
    # print(f"Result: {Result}")
    
