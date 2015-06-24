# ABTestJS
An AB Testing framework for Javascript

How to use:
There are two objects that you will end up creating: TestCase objects and ABTest objects.
The first represents a single test case that you would like to have. This can be anything from styling an element 
differently to displaying a completely different site.
The second represents a single test you are conducting. A test consists of multiple test cases each of which has a
certain likelihood of being displayed for any user.
This framework garuntees that given the same identifier, the exact same TestCase will be used.

TestCase (name, weight, options):<br>

name: The name to be associated with this individual case<br>
weight: The weight assigned to this case. Weights are relative among TestCases.
options:

target: element to change on test initialization if this case is chosen
CSS: CSS attributes to apply to the target if this case is chosen
callback: function to be called when the test is initialized if this case is chosen


ABTest(name, identifier, testcases, options):
