#  <p align ="center" height="40px" width="40px"> Skin Disease AI Identification for Fine-Tune Gemini 1.5 model </p>

### <p align ="center"> Implemented using: </p>
<p align ="center">
<a href="https://www.python.org/" target="_blank" rel="noreferrer">   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png" width="32" height="32" /></a>
<a href="https://opencv.org/" target="_blank" rel="noreferrer">   <img src="https://opencv.org/wp-content/uploads/2022/05/logo.png" width="32" height="32" /></a>  
<a href="https://keras.io/" target="_blank" rel="noreferrer">   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Keras_logo.svg/1200px-Keras_logo.svg.png" width="32" height="32" /></a> 
<a href="https://www.tensorflow.org/" target="_blank" rel="noreferrer">   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Tensorflow_logo.svg/115px-Tensorflow_logo.svg.png?20170429160244" width="32" height="32" /></a> 
<a href="https://scikit-learn.org/stable/" target="_blank" rel="noreferrer">   <img src="https://e7.pngegg.com/pngimages/309/384/png-clipart-scikit-learn-python-computer-icons-scikit-machine-learning-learning-text-orange.png" width="32" height="32" /></a>  
<a href="https://numpy.org/" target="_blank" rel="noreferrer">   <img src="https://numpy.org/images/logo.svg" width="32" height="32" /></a>  
<a href="https://seaborn.pydata.org/" target="_blank" rel="noreferrer">   <img src="https://seaborn.pydata.org/_images/logo-tall-lightbg.svg" width="32" height="32" /></a> 
<a href="https://matplotlib.org/" target="_blank" rel="noreferrer">   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Created_with_Matplotlib-logo.svg/2048px-Created_with_Matplotlib-logo.svg.png" width="32" height="32" /></a> 
</p>

<br>

##     <p align = "left"> 📂 Repository Structure </p>
 -  'preprocessing.py': This code loads the entire dataset, perform the required image preprocessing, and splits the images into train, validation and test sets.

 -  'sets_visualization.py': This code used to show the distribution of the different skin lesions' types through the train, validation and test sets.

 -  'augmentation.py': Code for adding augmented images to our dataset for classes with a lack of images.

 -  'model.py': The code we used to build our Xception model for skin lesion diagnosis.

 -  'evaluate.py': Code for evaluating our model for fine-tuning and better understanding. It shows the confusion matrix, accuracy and loss histograms, and classification  report.

 -  'predict.py': Code for prediction a batch of images from a directory, using our model. 
