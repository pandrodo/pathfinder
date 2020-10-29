import React from "react";
import L from 'leaflet';

import configureStore from "../../store";
import {render, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Provider} from "react-redux";
import LeafletMap from "./index";
import {setAlgorithm, setEndPoint, setStartPoint} from "../../store/inputForm/actions";
import {addNewPointStart, getPointsSuccess} from "../../store/users/actions";

import * as userActions from '../../store/users/actions';
import {setupServer} from "msw/node";
import {rest} from "msw";

describe("The LeafletMap", () => {
    const server = setupServer(
        rest.post('http://127.0.0.1:3000/addUserPoint',(req, res, ctx) => {
            return res(ctx.status(200));
        }),
    );

    beforeAll(() => server.listen());
    afterEach(() => {
        server.resetHandlers();
        jest.restoreAllMocks();
    });
    afterAll(() => server.close());

    it("clears markers on map then points changed", async () => {
        const store = configureStore();

        render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        const removeLayerSpy = jest.spyOn(L.Layer.prototype, "remove");

        store.dispatch(getPointsSuccess([{nodeId: '1', name: 'Point 1'}, {nodeId: '2', name: 'Point 2'}]));

        await waitFor(() => {
            expect(removeLayerSpy).toHaveBeenCalledTimes(10);
        });
    });

    it("saves calculated route to local storage", async () => {
        const store = configureStore();
        store.dispatch(setStartPoint('1788932701'));
        store.dispatch(setEndPoint('1788932701'));
        store.dispatch(setAlgorithm('aGreedy'));

        render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        store.dispatch(setEndPoint('582469522'));

        await waitFor(() => {
            expect(localStorage.getItem('aGreedy-1788932701-582469522')).not.toEqual(null);
        });
    });

    it("gets previously calculated route from local storage", async () => {
        const store = configureStore();
        store.dispatch(setStartPoint('1788932701'));
        store.dispatch(setEndPoint('1788932701'));
        store.dispatch(setAlgorithm('aGreedy'));

        render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        const jsonParseSpy = jest.spyOn(JSON, "parse");

        store.dispatch(setEndPoint('582469522'));

        await waitFor(() => {
            expect(jsonParseSpy).toHaveBeenCalledTimes(1);
        });

        localStorage.clear();
    });

    it("shows nothing if route has not been calculated", () => {
        const store = configureStore();
        store.dispatch(setStartPoint('1788932701'));
        store.dispatch(setEndPoint('1788932701'));
        store.dispatch(setAlgorithm('wrong algorithm'));

        const {rerender} = render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        const addLayerSpy = jest.spyOn(L.LayerGroup.prototype, "addLayer");

        store.dispatch(setEndPoint('582469522'));

        rerender(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        expect(addLayerSpy).toHaveBeenCalledTimes(0);
    });

    it("clears previous route on map when input form changed", async () => {
        const store = configureStore();
        store.dispatch(setStartPoint('1788932701'));
        store.dispatch(setEndPoint('1788932701'));
        store.dispatch(setAlgorithm('dijkstra'));

        render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        store.dispatch(setEndPoint('582469522'));
        store.dispatch(setEndPoint('1788932701'));

        const removeLayerSpy = jest.spyOn(L.Layer.prototype, "remove");

        await waitFor(() => {
            expect(removeLayerSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("opens prompt for new point name on map click after new point button click", async () => {
        const store = configureStore();

        const {container} = render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        store.dispatch(addNewPointStart());

        const windowPrompt = window.prompt;
        window.prompt = jest.fn(() => 'New Point');

        if (container && container.firstElementChild) {
            userEvent.click(container.firstElementChild);
        }

        await waitFor(() => {
            expect(window.prompt).toHaveBeenCalledTimes(1);
        });

        window.prompt = windowPrompt;
    });

    it("dispatches add new point action after prompt if prompt return not empty string", async () => {
        const store = configureStore();

        const {container} = render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        store.dispatch(addNewPointStart());

        const windowPrompt = window.prompt;
        window.prompt = jest.fn(() => 'New Point');
        const addNewPointSpy = jest.spyOn(userActions, 'addNewPoint');

        if (container && container.firstElementChild) {
            userEvent.click(container.firstElementChild);
        }

        await waitFor(() => {
            expect(addNewPointSpy).toHaveBeenCalledTimes(1);
        });

        window.prompt = windowPrompt;
    });

    it("dispatches no action after prompt if prompt return empty string", async () => {
        const store = configureStore();
        store.dispatch(getPointsSuccess([]));

        const {container} = render(
            <Provider store={store}>
                <LeafletMap/>
            </Provider>
        );

        store.dispatch(addNewPointStart());

        const windowPrompt = window.prompt;
        window.prompt = jest.fn(() => '');
        const addNewPointSpy = jest.spyOn(userActions, 'addNewPoint');

        if (container && container.firstElementChild) {
            userEvent.click(container.firstElementChild);
        }

        await waitFor(() => {
            expect(addNewPointSpy).toHaveBeenCalledTimes(0);
        });

        window.prompt = windowPrompt;
    });
});