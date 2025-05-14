# Excalidraw Migration Plan

## Architecture Plan for Transitioning to Excalidraw

1. **Create Excalidraw Components**:

   - Create an ExcalidrawEditor component for editing drawings
   - Create an ExcalidrawViewer component for viewing drawings

2. **Backend Storage**:

   - Create a mechanism to store and retrieve Excalidraw JSON data
   - This will replace storing just Google Drawing IDs

3. **API Endpoints**:

   - Create endpoints to save and load Excalidraw drawings
   - Implement in the existing API structure

4. **Frontend Integration**:

   - Update the StratDisplay component to use Excalidraw instead of Google Drawings iframe
   - Update the CreateStratDialog to work with Excalidraw

5. **Implementation Order**:
   - Step 1: Create the basic Excalidraw components
   - Step 2: Set up API for saving/loading drawings
   - Step 3: Update the UI components
   - Step 4: Update the database schema if necessary

Note: No data migration needed as there are no existing users.
