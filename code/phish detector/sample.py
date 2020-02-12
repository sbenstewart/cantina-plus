# Purpose - This file is used to create a classifier and store it in a .pkl file. You can modify the contents of this
# file to create your own version of the classifier.

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn import metrics

from scikit_roughsets.rs_reduction import RoughSetsSelector

import joblib

labels = []
data_file = open('dataset/Training Dataset.arff').read()
data_list = data_file.split('\r\n')
data = np.array(data_list)
data1 = [i.split(',') for i in data]
data1 = data1[0:-1]
for i in data1:
    labels.append(i[30])
data1 = np.array(data1)
features = data1[:, :-1]
# Choose only the relevant features from the data set.
# features = features[:, [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 27, 29]]
features = np.array(features).astype(np.int)
labels = np.array(labels).astype(np.int)

print(features)
print(labels)

y = features.T
X = labels

selector = RoughSetsSelector()
X_selected = selector.fit(X, y).transform(X)

print(X_selected)