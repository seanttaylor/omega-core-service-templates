### Omega Framework

The Omega Framework is a collection of existing open-source packages and file templates designed to generate an HTTP API from an Open API specification.

#### Technical Rationale

The majority of software solutions first require the creation of boilerplate files and code that, while necessary for an application to run, do not immediately advance the goal of building a given application feature.

Writing boilerplate code is tedious and time-consuming; copying and pasting is error-prone. Anything that can be copied and pasted can be automated.

Having the means to consisently generate code from a specification file creates an idempotent process; we get the same artifact from the same inputs. This is a lesson that has been well-taught and well-learned by the DevOps community.

We save developer time by reducing the effort required to scaffold a project. Generators and scaffolding tools are not new. The Omega Framework is an attempt to enhance the out-of-box experience by allowing developers to begin an API project focused on data and models rather than preoccupied with API routes and plumbing.


#### Business Rationale

Prototyping quickly and delivering features are critical functions of engineering teams. Providing the ability to experiment and validate ideas is among the most important value propositions of a software developers within an organization.

Allowing developers to stamp out code, prototypes and features means time savings, money savings and the most valuable direction of technical resources possible.


### Getting Started 

A critical component of the Omega Framework is the [`swagger-node-codegen`](https://www.npmjs.com/package/swagger-node-codegen) package. Ensure that you have this package installed as it provides the actual code generation mechanism.

To generate project scaffolding do:

1. `$snc [_./path/to/swagger/specification.yaml_] -o [_./path/to/output/directory_] -t [_./path/to/template/folder_]`

##### Notes

In addition to the below, more documentation is available in the `swagger-node-codegen` documentation.

* Only the path to the specification file is required in order to generate scaffolding.
* Specification file may be in *.yaml or *.json format
* If NO output directory is specified, code is output to the current directory.
* If NO template directory is specified, code will be output using the default template provided by the `swagger-node-codegen` package.



