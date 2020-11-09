import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from "react-redux";
import '@testing-library/jest-dom/extend-expect';

import configureStore from "../../store";
import {setAvailablePathfinders} from "../../store/map/actions";
import {getPointsSuccess} from "../../store/users/actions";

import InputForm from "./index";

describe("The InputForm component", () => {
    it("shows start point select and it changes store state on change", () => {
        const store = configureStore();

        render(
            <Provider store={store}>
                <InputForm/>
            </Provider>
        );

        const startPointSelectNode = screen.getByRole('combobox', {name: 'Start'});
        expect(startPointSelectNode).toBeInTheDocument();

        const startPointOptionNode = screen.getAllByRole('option', {name: 'Вокзал'})[0] as HTMLOptionElement;
        expect(startPointOptionNode).toBeInTheDocument();

        userEvent.selectOptions(startPointSelectNode, startPointOptionNode);
        expect(startPointSelectNode).toHaveValue(startPointOptionNode.value);
    });

    it("shows end point select and it changes store state on change", () => {
        const store = configureStore();

        render(
            <Provider store={store}>
                <InputForm/>
            </Provider>
        );

        const endPointSelectNode = screen.getByRole('combobox', {name: 'End'});
        expect(endPointSelectNode).toBeInTheDocument();

        const endPointOptionNode = screen.getAllByRole('option', {name: 'Вокзал'})[1] as HTMLOptionElement;
        expect(endPointOptionNode).toBeInTheDocument();

        userEvent.selectOptions(endPointSelectNode, endPointOptionNode);
        expect(endPointSelectNode).toHaveValue(endPointOptionNode.value);
    });

    it("shows algorithm select and it changes store state on change", () => {
        const store = configureStore();
        store.dispatch(setAvailablePathfinders(['aStar']));

        render(
            <Provider store={store}>
                <InputForm/>
            </Provider>
        );

        const algorithmPointSelectNode = screen.getByRole('combobox', {name: 'Algorithm'});
        expect(algorithmPointSelectNode).toBeInTheDocument();

        const algorithmPointOptionNode = screen.getByRole('option', {name: 'aStar'}) as HTMLOptionElement;
        expect(algorithmPointOptionNode).toBeInTheDocument();

        userEvent.selectOptions(algorithmPointSelectNode, algorithmPointOptionNode);
        expect(algorithmPointSelectNode).toHaveValue(algorithmPointOptionNode.value);
    });

    it("updates start and end points selects options and its values for user with points", async () => {
        const store = configureStore();

        render(
            <Provider store={store}>
                <InputForm/>
            </Provider>
        );

        const startPointSelectNode = screen.getByRole('combobox', {name: 'Start'});
        const endPointSelectNode = screen.getByRole('combobox', {name: 'End'});

        store.dispatch(getPointsSuccess([{nodeId: '1', name: 'Point 1'}, {nodeId: '2', name: 'Points 2'}]));

        await waitFor(() => {
            expect(startPointSelectNode).toHaveValue('1');
            expect(endPointSelectNode).toHaveValue('1');
        });
    });

    it("contains default start and end points selects options and its values for user without points", async () => {
        const store = configureStore();

        render(
            <Provider store={store}>
                <InputForm/>
            </Provider>
        );

        store.dispatch(getPointsSuccess([]));

        const startPointSelectNode = screen.getByRole('combobox', {name: 'Start'});
        const endPointSelectNode = screen.getByRole('combobox', {name: 'End'});

        await waitFor(() => {
            expect(startPointSelectNode).toHaveValue('1788932701');
            expect(endPointSelectNode).toHaveValue('1788932701');
        });
    });
});