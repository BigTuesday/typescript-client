from nludb import NLUDB
from typing import Dict
from dataclasses import dataclass
from functools import wraps

# TODO: Use functools to properly lift the function name and docstrings from the wrapped functions.

@dataclass
class Invocation:
  """An invocation of a method on an app instance.

  This is the payload sent from the public-facing App Proxy to the
  private-facing app microservice.
  """
  app_id: str = None                # e.g. slack/room_search
  instance_id: str = None           # e.g. @nludb/#main
  verb: str = None                  # e.g. POST
  method: str = None                # e.g. /predict
  arguments: Dict[str, any] = None  # e.g. { input: "foo" }

  @staticmethod
  def safely_from_dict(d) -> "Invocation":
    if d is None:
      print("Error: inbound event was None")
      return Invocation()
    if type(d) != dict:
      print("Error: inbound event was not a Dict")
      return Invocation()

    return Invocation(
      app_id = d.get('app_id', None),
      instance_id = d.get('instance_id', None),
      method = d.get('method', None),
      arguments = d.get('arguments', dict())
    )

class App:
  """An NLUDB microservice.

  This base class:

    1. Provide a pre-authenticated instance of the NLUDB client
    2. Provides a Lambda handler that routes to registered functions
    3. Provides useful methods connecting functions to the router.
  """
  _method_mappings = {}

  def __init__(self):
    self.nludb = NLUDB()

  @staticmethod
  def _register_mapping(verb: str, path: str, name: str):
    """Registering a mapping permits the method to be invoked via HTTP."""
    print("Registering path->function mapping: {} {} -> {}".format(verb, path, name))
    if verb not in App._method_mappings:
      App._method_mappings[verb] = {}
    App._method_mappings[verb][path] = name

  @staticmethod
  def post(path: str):
    def decorator(function):
      App._register_mapping('POST', path, function.__name__)

      def function_wrapper(self, *args, **kwargs):
        return function(self, **kwargs)
      return function_wrapper
    return decorator

  @staticmethod
  def get(path: str):
    def decorator(function):
      App._register_mapping('GET', path, function.__name__)

      def function_wrapper(self, *args, **kwargs):
        return function(self, **kwargs)
      return function_wrapper
    return decorator

  def make_error(self, http_status: int = 500, message: str = "Server Error"):
    return dict(status=http_status, message=message)

  def __call__(self, invocation: Invocation, context: any = None):
    """Invokes a method call if it is registered."""
    if invocation.verb not in App._method_mappings:
      return self.make_error(404, "No methods for verb {} available.".format(invocation.verb))
    if invocation.method not in App._method_mappings[invocation.verb]:
      return self.make_error(404, "No handler for {} {} available.".format(invocation.verb, invocation.method))

    method = App._method_mappings[invocation.verb][invocation.method]

    if not (hasattr(self, method) and callable(getattr(self, method))):
      return self.make_error(500, "Handler for {} {} not callable.".format(invocation.verb, invocation.method))

    return getattr(self, method)(self, **invocation.arguments)
