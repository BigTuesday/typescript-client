
from sdk.base import App, Invocation

# Create an app by extending the App baseclass
#
class HelloWorldApp(App):

    # Register a function as an API endpoint with @App.post or @App.get
    # Note: The 'App' here must be the baseclass; if you imported App as Fence you would have to say Fence.post
    @App.post('hi')
    def test_api_endpoint(self, name: str):
        return "Hello, {}".format(name)


def app_handler(event, context):
    app = HelloWorldApp()

    invocation = Invocation(
      verb="POST",
      method="hi",
      arguments=event.get('data', {})
    )

    return {'result': app(invocation)}
