
# HACKATHON inFer GW4 network "Fertility: In Vitro, In Silico, In Clinico"

GOAL: Classify and visualize spermatozoon’s flagella by creating a tool that will analyses the beat pattern data and characterizes flagella waveforms in bovine spermatozoa.


RESULT: The Sperm Beat Analysis Platform is launched here.

# Introduction: 

Despite the crucial role of sperm flagellar waveforms in cell motility, computer-aided sperm analysis systems have traditionally faced challenges in examining these complex patterns due to obstacles related to information extraction, manipulation, and processing. Recent advancements in imaging techniques and data processing have significantly enhanced waveform digitization methods. However, even when spermatozoa appear normal in microscopic observations, issues in the distal region, such as blebbing, may go unnoticed, making it challenging to determine amplitude, frequency, and distinguish between fresh and frozen sperm. To address these limitations, we have chosen to develop a machine learning model specifically designed to classify sperm beat patterns based on provided data. This model will not only discern abnormalities like blebbed sperm but will also evaluate its accuracy in distinguishing between fresh and frozen samples. Our platform integrates user-friendly features, enabling researchers to easily reproduce the analyses and figures presented in the manuscript. Additionally, the platform operates in real-time, facilitating immediate analysis and interpretation of results. 
This approach facilitates exploration and understanding of the research findings. Moreover, the platform's capability to identify anomalous beat patterns within the dataset adds a valuable layer of insight to sperm analysis.
The project meets the requirements of the hackathon in the following ways:
Specific: We created a Platform to classify sperm beat pattern classification, identify anomalous beat patterns in the dataset and user-friendly that allows researchers to reproduce the analyses and figures presented in the manuscript.
Measurable: Our digital solution aims to deliver measurable outcomes in the realm of sperm analysis. The machine learning model, designed to classify sperm beat patterns, not only identifies abnormalities like blebbing but also rigorously evaluates its accuracy in distinguishing between fresh and frozen sperm samples. 
Achievable: our digital solution is both sensible and practical, (but mostly practical), successfully implemented within the allocated time frame and utilizing available resources. It stands as an efficient and comprehensive tool for sperm pattern classification and anomaly detection, meeting the needs and expectations of researchers in the field.

# Objectives:
# Data comprehension and reshaping: 

The dataset, encapsulated in the `all_data.zip` archive, complements the research on computer-assisted beat-pattern analysis and flagellar waveforms of bovine spermatozoa. The accompanying ZIP file contains the same data in CSV format, each corresponding to a specific swimmer with structured data for each analyzed waveform, featuring normal and tangent angle forms, dimensional flagellum length, original filenames, and flags for fresh, frozen, and blebbed sperm.  The Cartesian data in this archive is not normalized in space. We treated the data using Python. 
After normalizing the Cartesian data, a table represents, for a specific swimmer, a thousand points with the Cartesian coordinates (x, y) (a thousand columns of x_values than another thousands of y_values) collected in a hundred rows (frames).
We had to reshape the Data using an algorithm we created so we can, using this function, visualize a graph of waveform flagella as represented below.
We conclude that we have 216 swimmers, where there is a sample A with 79 fresh sperms (only_fresh) and a sample B with 137 frozen sperms (103 only_frozen and 34 Blebbed).

# Machine learning and classification method:

To distinguish between fresh, frozen and blebbed sperm group, or between optimal and minimal groups in general, we considered Velocity described as the amplitude traveled in a given period of the point x-500, the period itself, and the length of the flagellum as parameters of distinguishing, as we assume it is considered to quantify beat patterns for any flagellate, even human spermatozoa.
We clustered, plotting K-Means Cluster with Python, the data of the groups after reducing the number of dimensions using PCA so that we can visualize the results using a 2D Scatter plot, by unsupervised machine learning. 
The following type of machine learning we will create, to classify sperms, will be based respecting this method, to have more precision. 
Classify within the only_frozen group.
Compare the classes provided with the Blebbed group.
Identify significant differences between the Blebbed group and the classes within only_frozen.
The class exhibiting significant differences with the Blebbed group is designated as the Normal group.
The remaining classes, along with the Blebbed group, are categorized as Abnormal.
"(Identify the threefold)"
Classify within only_fresh.
Compare with the Normal class within only_frozen.
The class showing significant differences with the normal class of the only_frozen group is labeled as Optimal.
The remaining classes are categorized as normal to low motility.
"(Identify the threefold)".

We trained our machine learning program with 200 spermatozoids’ Data, 16 spermatozoids’ Data was divided in two, to test the program when pre GUI and when using the GUI app.
The machine learning got 73.41 % accuracy.

# Classification result and machine learning:

After generating the classes inside the groups we get these results in an unsupervised way, so the following step was to find significant differences to identify a threefold.

![](https://github.com/chahid001/Project-optimal-spespe-for-the-challenge-2-of-the-HACKATHON-inFer-GW4-network-Fertility-In-Vitro-/blob/main/pic/pic2.png)

After comparison between the groups we find that all groups show significant differences in period and length and what makes the difference between small colored groups is the velocity.
We find that Blebbed is the worst case, and when it comes to frozen group, only_frozen_bleu and green are classed Minimals meanwhile only_frozen_orange is classed optimal, and for the only_fresh group the blue class is optimal meanwhile the orange one is minimal.


![](https://github.com/chahid001/Project-optimal-spespe-for-the-challenge-2-of-the-HACKATHON-inFer-GW4-network-Fertility-In-Vitro-/blob/main/pic/pic3.png)

This classification helped us to identify a method to find some threefold for the following creation of the second machine learning. 

The Cut-Off was calculated using standard deviation by adding it to the mean value when the class is inferior and subtracts it when the class is superior. The cutoff is the mean of the values obtained. 

![](https://github.com/chahid001/Project-optimal-spespe-for-the-challenge-2-of-the-HACKATHON-inFer-GW4-network-Fertility-In-Vitro-/blob/main/pic/pic1.png)


We trained our machine learning program with 200 spermatozoids’ Data, 16 spermatozoids’ Data was divided in two, to test the program when pre GUI and when using the GUI app.
The machine learning got 73.41 % accuracy.

# Mathematical section: 


Velocity is a parameter we set to describe the amplitude traveled in a given period of the point x-500: 
We measured this parameter by identifying in the first place the maximum and minimum value of this point in the Y-value axis of the beat pattern, than we calculated the difference of this values divided by two to measure then the ratio with the period given in the data (T) :

Ve=((|max-min|/2)/T)  

# Assumption:

# The GUI:

An overview of the platform
The platform uses a Graphical User Interface (GUI) to allow easy manipulation of input Data.
The platform proposes an input button for Data files from TRACKMATE and accepts only Excel or CSV formats.
After uploading a file the user can choose between having a default result or a customized one where the sample type (Frozen or Fresh) and the range of the waveforms can be defined.
There is a slider for the range of the flagella waveform graphs.
Given these input values, the program reports a graphic illustration of the beat pattern with additional values which are considered as parameters of classification (optimal, minimal or Blebbed). Any output can be downloaded as image .JPG/.JPEG or as a report PDF.

The GUI is published [here](http://optimal-spespe.me/)

# TEAM: 

The team is comprised of four students from two different universities and different departments. From the department of Biology of University Mohamed V, two students, a master’s student of Genomics and Bioinformatics and a graduate student of Biology and Health, and from the physics department of the same university, a graduate student of theorical physics, and finally a Bachelor student of IT Architecter Expert from the 1337 school department of University Mohamed 6 – Polytechnic. The group received additional advice from their common supervisor, Pr. Aïcha Madkour, a human reproduction specialist.
